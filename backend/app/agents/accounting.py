from typing import List
from .base import BaseSkill
from ..db.mongodb import mongodb
from ..services.attendance import attendance_service
from langchain_core.messages import SystemMessage, HumanMessage
from ..core.llm_manager import llm_manager
import json

class AccountingSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Kế toán & Nhân sự",
            description="Xử lý bảng lương, doanh thu, nợ và các báo cáo tài chính."
        )

    async def get_capabilities(self) -> List[dict]:
        return [
            {"id": "calculate_payroll", "name": "Tính lương tháng", "desc": "Tính lương dựa trên công thức, ngày công và phụ cấp."},
            {"id": "revenue_report", "name": "Báo cáo doanh thu", "desc": "Tổng hợp doanh số và chi phí theo kỳ."},
            {"id": "attendance_tracking", "name": "Quản lý chấm công", "desc": "Tra cứu số ngày làm việc thực tế của nhân viên."}
        ]

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        return f"""
        Bạn là chuyên viên Kế toán và Nhân Sự (C&B) của CÔNG TY TNHH CÔNG NGHỆ EXP.
        Nhiệm vụ:
        - Tính toán chính xác các số liệu doanh thu, chi phí, lương.
        - LƯU Ý CÔNG THỨC TÍNH LƯƠNG THÁNG 02/2026 (Theo bảng lương mẫu):
          1. Tổng thu nhập định mức = Lương HĐ + Phụ cấp xăng xe & ĐT + Hỗ trợ khác + Ăn ca.
          2. Ngày công chuẩn (Standard Days) = 24 ngày (đã bao gồm lễ tết).
          3. Tổng cộng (Gross) = (Tổng thu nhập định mức) * (Ngày công thực tế + Ngày lễ tết) / Ngày công chuẩn.
          4. Khấu trừ bảo hiểm (10.5% lương HĐ) = BHXH (8%) + BHYT (1.5%) + BHTN (1%).
          5. Thực lĩnh = Tổng cộng - Khấu trừ bảo hiểm.
        
        - QUY ĐỊNH BẢO MẬT: 
          Người đang hỏi bạn là '{username}' với quyền '{user_role.upper()}'.
          Nếu quyền là USER, chỉ cung cấp thông tin cá nhân của họ. Tuyệt đối không tiết lộ lương người khác.
          Nếu quyền là ADMIN, hiển thị báo cáo chi tiết mọi nhân viên.
        - Giọng văn: Chuyên nghiệp, liệt kê số liệu từng bước tính toán rõ ràng.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        # Mặc định lấy theo tháng hiện tại của yêu cầu (ví dụ tháng 2/2026)
        month, year = 2, 2026 
        
        if user_role == "admin":
            accounting_data = await mongodb.db.accounting.find().to_list(length=10)
            employees = await mongodb.db.employees.find().to_list(length=30)
            # Lấy chấm công của tất cả nhân viên
            attendance_list = await mongodb.db.attendance.find({"month": month, "year": year}).to_list(length=50)
        else:
            accounting_data = []
            employees = await mongodb.db.employees.find({"username": username}).to_list(length=1)
            # Lấy chấm công qua service (bridge cho tương lai)
            res_attr = await attendance_service.get_attendance(username, month, year)
            attendance_list = [{"username": username, **res_attr}]
        
        # Làm sạch ID
        for doc in accounting_data + employees + attendance_list:
            doc.pop("_id", None)

        context = f"""
        ======== DỮ LIỆU KẾ TOÁN & NHÂN SỰ ========
        1. Báo cáo doanh thu/chi phí (Accounting):
        {json.dumps(accounting_data, ensure_ascii=False)}
        
        2. Bảng lương cơ bản nhân viên (Employees):
        {json.dumps(employees, ensure_ascii=False)}
        
        3. Bảng chấm công thực tế theo tháng (Attendance):
        {json.dumps(attendance_list, ensure_ascii=False)}
        ================================================

        Câu hỏi / Yêu cầu của người dùng: {user_input}
        
        Hãy sử dụng CÔNG THỨC trong hướng dẫn và DỮ LIỆU phía trên để giải quyết, tính toán chi tiết và trả lời câu hỏi của khách hàng.
        """

        # 1. Tải cấu hình LLM từ DB/Settings
        keys = await self.get_provider_keys()
        llm = llm_manager.get_chat_model(
            model_name=keys.get("default_model"),
            api_key=keys.get("model_api_key"),
            api_base=keys.get("model_api_url")
        )

        system_prompt = await self.get_system_prompt(user_role, username)
        msgs = [SystemMessage(content=system_prompt), HumanMessage(content=context)]
        
        response = await llm.ainvoke(msgs)
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        return response.content, total_tokens
