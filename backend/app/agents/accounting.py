from .base import BaseSkill
from ..db.mongodb import mongodb
from langchain_core.messages import SystemMessage, HumanMessage
import json

class AccountingSkill(BaseSkill):
    def __init__(self):
        super().__init__(
            name="Kế toán & Nhân sự",
            description="Xử lý bảng lương, doanh thu, nợ và các báo cáo tài chính."
        )

    async def get_system_prompt(self, user_role: str = "user", username: str = "guest") -> str:
        return f"""
        Bạn là chuyên viên Kế toán và Nhân Sự (C&B) vô cùng chính xác, cẩn thận.
        Nhiệm vụ:
        - Tính toán các số liệu doanh thu, chi phí, lợi nhuận.
        - Trả lời về các hóa đơn chưa thanh toán hoặc bảng lương nhân viên.
        - LƯU Ý QUAN TRỌNG KHI TÍNH LƯƠNG:
          Quy chuẩn 1 tháng làm việc có 22 ngày công.
          Công thức tính LƯƠNG THỰC LÃNH:
          Lương thực lãnh = (Lương cơ bản / 22) * Số ngày chấm công + Phụ cấp - Khấu trừ
          Bạn KHÔNG ĐƯỢC tính sai số học các phép nhân chia cộng trừ. Hãy tính từng bước rõ ràng.
        - BẢO MẬT DỮ LIỆU: Người đang hỏi bạn có TÀI KHOẢN là '{username}' và QUYỀN HẠN là '{user_role.upper()}'.
          Nếu quyền là USER, bạn CHỈ ĐƯỢC PHÉP từ chối trả lời thông tin của người khác hoặc các báo cáo doanh thu chung. Chỉ cung cấp đúng thông tin cá nhân của người đó (nếu có).
          Nếu quyền là ADMIN, cung cấp thoải mái mọi số liệu.
        - Giọng văn: Nghiêm túc, minh bạch, báo cáo kiểu liệt kê tường minh các số liệu. Hãy hiển thị từng phép tính khi báo cáo lương người đó.
        - Ngôn ngữ: Tiếng Việt.
        """

    async def chat(self, user_input: str, user_role: str = "user", username: str = "guest", history: list = []) -> tuple[str, int]:
        # Lấy dữ liệu từ MongoDB liên quan tới kế toán, nhân viên và chấm công
        if user_role == "admin":
            accounting_data = await mongodb.db.accounting.find().to_list(length=10)
            employees = await mongodb.db.employees.find().to_list(length=20)
            attendance = await mongodb.db.attendance.find().to_list(length=50)
        else:
            # Nếu user thường, chỉ lấy dòng dữ liệu của đúng người đó
            accounting_data = [] # User không được xem báo cáo TC
            employees = await mongodb.db.employees.find({"name": {"$regex": f"^{username}$", "$options": "i"}}).to_list(length=1)
            attendance = await mongodb.db.attendance.find({"name": {"$regex": f"^{username}$", "$options": "i"}}).to_list(length=31)
        
        # Bỏ đi _id để serialize
        for doc in accounting_data + employees + attendance:
            doc.pop("_id", None)

        context = f"""
        ======== DỮ LIỆU KẾ TOÁN & NHÂN SỰ ========
        1. Báo cáo doanh thu/chi phí (Accounting):
        {json.dumps(accounting_data, ensure_ascii=False)}
        
        2. Bảng lương cơ bản nhân viên (Employees):
        {json.dumps(employees, ensure_ascii=False)}
        
        3. Bảng chấm công thực tế theo tháng (Attendance):
        {json.dumps(attendance, ensure_ascii=False)}
        ================================================

        Câu hỏi / Yêu cầu của người dùng: {user_input}
        
        Hãy sử dụng CÔNG THỨC trong hướng dẫn và DỮ LIỆU phía trên để giải quyết, tính toán chi tiết và trả lời câu hỏi của khách hàng.
        """

        system_prompt = await self.get_system_prompt(user_role, username)
        msgs = [SystemMessage(content=system_prompt), HumanMessage(content=context)]
        
        response = await self.llm.ainvoke(msgs)
        usage = getattr(response, "usage_metadata", {})
        total_tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        return response.content, total_tokens
