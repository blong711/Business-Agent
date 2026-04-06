export type Language = 'vi' | 'en';

export interface TranslationSchema {
  nexusChat: string;
  prodManagement: string;
  prodTime: string;
  cskh: string;
  teleData: string;
  accHr: string;
  payroll: string;
  marketingMgt: string;
  creativeAsset: string;
  sysAdmin: string;
  accManagement: string;
  logout: string;
  profile: string;
  searchPlaceholder: string;
  themeLight: string;
  themeDark: string;
  langVi: string;
  langEn: string;
  chatPlaceholder: string;
  agentThinking: string;
  typing: string;
  welcome: string;
  adminUsersTitle: string;
  adminUsersSubtitle: string;
  username: string;
  role: string;
  status: string;
  telegramId: string;
  createdAt: string;
  actions: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  loading: string;
  noData: string;
  active: string;
  suspended: string;
  adminRole: string;
  userRole: string;
  notLinked: string;
  editUserTitle: string;
  accountStatus: string;
  adminTeleTitle: string;
  adminTeleSubtitle: string;
  groupName: string;
  members: string;
  lastActive: string;
  viewDetails: string;
  noGroups: string;
  backToGroups: string;
  memberDetails: string;
  interactionHistory: string;
  noHistory: string;
  adminEmpTitle: string;
  adminEmpSubtitle: string;
  empName: string;
  position: string;
  department: string;
  salary: string;
  allowance: string;
  noEmpData: string;
  syncNexus: string;
  editEmp: string;
  empPosition: string;
  contractSalary: string;
  allowanceFuel: string;
  allowanceMeal: string;
  allowanceOther: string;
  posDirector: string;
  posSales: string;
  posDev: string;
  posAccountant: string;
  posProd: string;
  posMarketing: string;
  adminProdTitle: string;
  adminProdSubtitle: string;
  minEstimate: string;
  maxEstimate: string;
  synchronize: string;
  days: string;
  stable: string;
  fast: string;
  ready: string;
  systemNodes: string;
  avgLatency: string;
  agentSync: string;
  logicAnalysis: string;
  prodLogicInfo: string;
  prodLogicFormula: string;
  prodLogicNote: string;
  profileTitle: string;
  personalInfo: string;
  security: string;
  saveChanges: string;
  changePassword: string;
  profileUpdateSuccess: string;
  login: string;
  register: string;
  welcomeBack: string;
  getStarted: string;
  noAccount: string;
  hasAccount: string;
  category: string;
  botGreeting: string;
  lastUpdate: string;
  viewMembers: string;
  membersOf: string;
  noMembers: string;
  back: string;
  displayName: string;
  lastInteraction: string;
  newUserGreeting: string;
  joinDate: string;
  updateError?: string;
  deleteAdminError?: string;
  deleteConfirm: string;
  deleteError?: string;
  loadHistoryError?: string;
  updateProdError?: string;
  connError?: string;
  updated_at: string;
  synchronized: string;
  saving: string;
  password: string;
  loginSystem: string;
  createAccount: string;
  speechNotSupported: string;
  listening: string;
  handsFreeLabel: string;
  liveLabel: string;
  handsFreeOff: string;
  handsFreeOn: string;
  handsFreeActive: string;
  handsFree: string;
  ttsOff: string;
  ttsOn: string;
  loadingHistory: string;
  agentSettings: string;
  adminAgentSettingsTitle: string;
  adminAgentSettingsSubtitle: string;
  capability: string;
  access: string;
  everyone: string;
  onlyAdmin: string;
  agentCapabilities: string;
  providerKeysTitle: string;
  providerKeysSubtitle: string;
  customCatKey: string;
  pentifineKey: string;
  merchizeKey: string;
  modelApiKey: string;
  modelApiUrl: string;
  defaultModel: string;
  telegramToken: string;
  elevenKey: string;
  voiceId: string;
  elevenModelId: string;
  keyPlaceholder: string;
  updateSuccess: string;
  agent_production: string;
  agent_production_desc: string;
  agent_cskh: string;
  agent_cskh_desc: string;
  agent_accounting: string;
  agent_accounting_desc: string;
  agent_marketing: string;
  agent_marketing_desc: string;
  cap_get_efs_order_info: string;
  cap_get_efs_order_info_desc: string;
  cap_get_pending_orders: string;
  cap_get_pending_orders_desc: string;
  cap_search_shop_info: string;
  cap_search_shop_info_desc: string;
  cap_get_production_bottlenecks: string;
  cap_get_production_bottlenecks_desc: string;
  cap_get_delivery_delays: string;
  cap_get_delivery_delays_desc: string;
  cap_get_provider_tracking: string;
  cap_get_provider_tracking_desc: string;
  cap_summarize_telegram: string;
  cap_summarize_telegram_desc: string;
  cap_analyze_sentiment: string;
  cap_analyze_sentiment_desc: string;
  cap_member_lookup: string;
  cap_member_lookup_desc: string;
  cap_calculate_payroll: string;
  cap_calculate_payroll_desc: string;
  cap_revenue_report: string;
  cap_revenue_report_desc: string;
  cap_attendance_tracking: string;
  cap_attendance_tracking_desc: string;
  cap_product_seo_title: string;
  cap_product_seo_title_desc: string;
  cap_product_description: string;
  cap_product_description_desc: string;
  cap_social_media_hooks: string;
  cap_social_media_hooks_desc: string;
  cap_ad_copy_gen: string;
  cap_ad_copy_gen_desc: string;
  adminMarketingTitle: string;
  adminMarketingSubtitle: string;
  nicheAnalysis: string;
  contentLibrary: string;
  trendingNiches: string;
  growth: string;
  copyContent: string;
}

export const translations: Record<Language, TranslationSchema> = {
  vi: {
    // Sidebar & Navigation
    nexusChat: 'Hội thoại Nexus',
    prodManagement: 'Quản lý Sản xuất',
    prodTime: 'Thời gian sản xuất',
    cskh: 'Chăm sóc Khách hàng',
    teleData: 'Dữ liệu Telegram',
    accHr: 'Kế toán & Nhân sự',
    payroll: 'Bảng lương nhân sự',
    marketingMgt: 'Quản lý Marketing',
    creativeAsset: 'Kho nội dung & Camp',
    sysAdmin: 'Quản trị Hệ thống',
    accManagement: 'Quản lý Tài khoản',
    logout: 'Đăng xuất hệ thống',
    profile: 'Trang cá nhân',

    // TopBar
    searchPlaceholder: 'Tìm kiếm dữ liệu...',
    themeLight: 'Giao diện Sáng',
    themeDark: 'Giao diện Tối',
    langVi: 'Tiếng Việt',
    langEn: 'English',

    // Chat
    chatPlaceholder: 'Nhập nội dung hội thoại...',
    agentThinking: 'Agent đang phân tích...',
    botGreeting: 'Chào mừng trở lại! Tôi có thể giúp gì cho bạn?',
    newUserGreeting: 'Chào mừng! Bạn cần hỗ trợ gì từ Hệ sinh thái Agent hôm nay?',
    typing: 'đang nhập...',
    welcome: 'Chào mừng',

    // Common
    actions: 'Hành động',
    edit: 'Sửa',
    delete: 'Xóa',
    status: 'Trạng thái',
    loading: 'Đang tải...',
    noData: 'Không tìm thấy dữ liệu.',
    createdAt: 'Ngày tạo',

    // Admin Users
    adminUsersTitle: 'Quản lý Tài khoản',
    adminUsersSubtitle: 'DANH SÁCH NGƯỜI DÙNG & PHÂN QUYỀN HỆ THỐNG NEXUS AI',
    username: 'Tài khoản',
    role: 'Phân quyền',
    telegramId: 'Telegram ID',
    joinDate: 'Ngày tham gia',
    active: 'Hoạt động',
    suspended: 'Đình chỉ',
    notLinked: 'Chưa liên kết',
    editUserTitle: 'Cấu hình người dùng:',
    userRole: 'Thành viên',
    adminRole: 'Quản trị viên',
    accountStatus: 'Trạng thái tài khoản',
    save: 'Lưu thay đổi',
    cancel: 'Hủy',
    updateError: 'Lỗi cập nhật người dùng',
    deleteAdminError: 'Không thể xóa tài khoản admin gốc!',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa người dùng',
    deleteError: 'Lỗi khi xóa người dùng',

    // Admin Telegram
    adminTeleTitle: 'Dữ liệu Telegram',
    adminTeleSubtitle: 'GIÁM SÁT HOẠT ĐỘNG NEXUS TRÊN CÁC NHÓM CHAT DOANH NGHIỆP',
    groupName: 'Tên Nhóm / Cuộc trò chuyện',
    category: 'Thể loại',
    lastUpdate: 'Cập nhật gần nhất',
    members: 'Thành viên',
    lastActive: 'Hoạt động cuối',
    viewDetails: 'Chi tiết',
    noGroups: 'Chưa có nhóm nào. Vui lòng thêm bot vào nhóm Telegram và nhắn tin.',
    backToGroups: 'Quay lại danh sách nhóm',
    memberDetails: 'Thông tin thành viên',
    interactionHistory: 'Lịch sử tương tác',
    noHistory: 'Chưa có lịch sử tương tác.',
    viewMembers: 'Xem thành viên',
    membersOf: 'Thành viên:',
    back: 'Quay về',
    displayName: 'Tên hiển thị',
    lastInteraction: 'Lần cuối tương tác',
    noMembers: 'Nhóm này chưa ghi nhận thành viên nào ngoài Bot.',

    // Admin Employees
    adminEmpTitle: 'Quản lý Nhân sự',
    adminEmpSubtitle: 'HỆ THỐNG ĐIỀU HÀNH & QUẢN TRỊ NGUỒN LỰC NEXUS',
    empName: 'Họ và tên',
    position: 'Chức vụ',
    department: 'Team',
    salary: 'Lương HĐ',
    allowance: 'Phụ cấp',
    noEmpData: 'Không có dữ liệu nhân sự.',
    syncNexus: 'Cập nhật dữ liệu từ Nexus Core...',
    editEmp: 'Chỉnh sửa:',
    empPosition: 'Chức vụ',
    contractSalary: 'Lương theo HĐ',
    allowanceFuel: 'Phụ cấp Xăng/ĐT',
    allowanceMeal: 'Phụ cấp Ăn ca',
    allowanceOther: 'Phụ cấp khác',
    posDirector: 'Giám đốc',
    posSales: 'Nhân viên Kinh doanh',
    posDev: 'Nhân viên Phần mềm',
    posAccountant: 'Kế toán',
    posProd: 'Sản xuất',
    posMarketing: 'Marketing',

    // Admin Production
    adminProdTitle: 'Production Core',
    adminProdSubtitle: 'TÙY CHỈNH THÔNG SỐ VẬN HÀNH HỆ THỐNG AGENT (KERNEL V1.0)',
    minEstimate: 'DỰ KIẾN TỐI THIỂU',
    maxEstimate: 'DỰ KIẾN TỐI ĐA',
    synchronize: 'ĐỒNG BỘ HỆ THỐNG',
    days: 'NGÀY',
    stable: 'ỔN ĐỊNH',
    fast: 'NHANH',
    ready: 'SẴN SÀNG',
    systemNodes: 'NÚT HỆ THỐNG',
    avgLatency: 'ĐỘ TRỄ TRUNG BÌNH',
    agentSync: 'ĐỒNG BỘ AGENT',
    logicAnalysis: 'PHÂN TÍCH LOGIC NEURAL',
    prodLogicInfo: 'Thời gian sản xuất này được nạp trực tiếp vào System Prompt của Agent.',
    prodLogicNote: '* Lưu ý: Thuật toán tự động bỏ qua các ngày nghỉ lễ và cuối tuần.',
    prodLogicFormula: 'Agent sẽ tính toán: [Gửi in] + [Số ngày cài đặt] = [Ngày dự kiến có Tracking].',

    // User Profile
    profileTitle: 'Hồ sơ người dùng',
    personalInfo: 'Thông tin cá nhân',
    security: 'Bảo mật & Hệ thống',
    updated_at: 'Cập nhật:',
    synchronized: 'Đã đồng bộ!',
    saveChanges: 'Lưu thay đổi',
    changePassword: 'Đổi mật khẩu',
    profileUpdateSuccess: 'Thông tin đã được cập nhật trên hệ thống Nexus Core.',
    saving: 'Đang lưu...',
    password: 'Mật khẩu',
    loginSystem: 'Đăng nhập Hệ Thống',
    createAccount: 'Khởi Tạo Tài Khoản',
    speechNotSupported: 'Trình duyệt không hỗ trợ Speech Recognition. Vui lòng dùng Chrome.',
    listening: 'Đang lắng nghe...',
    handsFreeLabel: 'RẢNH TAY',
    liveLabel: 'TRỰC TIẾP',
    handsFreeOff: 'Tắt chế độ rảnh tay',
    handsFreeOn: 'Bật chế độ rảnh tay',
    handsFreeActive: 'Chế độ rảnh tay đang bật...',
    handsFree: 'Rảnh tay',
    ttsOff: 'Tắt đọc tự động',
    ttsOn: 'Bật đọc tự động',
    loadingHistory: 'Đang tải lịch sử hội thoại...',

    // Auth
    login: 'Đăng nhập',
    register: 'Đăng ký',
    welcomeBack: 'Chào mừng trở lại',
    getStarted: 'Bắt đầu ngay',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?',
    agentSettings: 'Cấu hình Agent',
    adminAgentSettingsTitle: 'Quản lý Kỹ năng Agent',
    adminAgentSettingsSubtitle: 'CẤU HÌNH TÍNH NĂNG VÀ PHÂN QUYỀN SỬ DỤNG CHO TỪNG BOT',
    capability: 'Kỹ năng / Công cụ',
    access: 'Quyền truy cập',
    everyone: 'Tất cả mọi người',
    onlyAdmin: 'Chỉ Admin',
    agentCapabilities: 'Danh sách kỹ năng',
    providerKeysTitle: 'Cấu hình API Key Nhà in',
    providerKeysSubtitle: 'QUẢN LÝ KHÓA TRUY CẬP TRỰC TIẾP CHO CÁC ĐƠN VỊ PRODUCTION',
    modelApiKey: 'Model API Key',
    modelApiUrl: 'Model API URL',
    defaultModel: 'Mô hình AI mặc định',
    telegramToken: 'Telegram Bot Token',
    elevenKey: 'ElevenLabs API Key',
    voiceId: 'ElevenLabs Voice ID',
    elevenModelId: 'ElevenLabs Model ID',
    customCatKey: 'CustomCat API Key',
    pentifineKey: 'Pentifine API Key',
    merchizeKey: 'Merchize API Key',
    keyPlaceholder: 'Nhập API key mới hoặc để trống để giữ nguyên...',
    updateSuccess: 'Cập nhật thành công!',
    agent_production: 'Agent Sản xuất',
    agent_production_desc: 'Chuyên gia điều phối sản xuất, tra cứu đơn hàng và xử lý vận đơn nhà in.',
    agent_cskh: 'Agent CSKH',
    agent_cskh_desc: 'Hỗ trợ giải đáp thắc mắc, kiểm tra trạng thái vận chuyển và thông tin khách hàng.',
    agent_accounting: 'Agent Kế toán',
    agent_accounting_desc: 'Quản lý bảng lương, đối soát tài chính và theo dõi chi phí vận hành.',
    agent_marketing: 'Agent Marketing',
    agent_marketing_desc: 'Chuyên gia sáng tạo nội dung, tối ưu tiêu đề SEO và nội dung quảng cáo đa kênh.',
    cap_get_efs_order_info: 'Tra cứu đơn hàng EFS',
    cap_get_efs_order_info_desc: 'Chiết xuất thông tin chi tiết về sản phẩm, trạng thái và lịch sử đơn hàng từ core EFS.',
    cap_get_pending_orders: 'Lấy danh sách đơn Pending',
    cap_get_pending_orders_desc: 'Liệt kê các đơn hàng đang chờ xử lý hoặc trong sản xuất theo trạng thái.',
    cap_search_shop_info: 'Tìm kiếm thông tin Shop',
    cap_search_shop_info_desc: 'Tra cứu chủ sở hữu, team quản lý và trạng thái hoạt động của các cửa hàng.',
    cap_get_production_bottlenecks: 'Báo cáo đơn kẹt sản xuất',
    cap_get_production_bottlenecks_desc: 'Tự động phát hiện các đơn hàng quá hạn mà chưa có thông tin vận đơn.',
    cap_get_delivery_delays: 'Báo cáo đơn giao chậm',
    cap_get_delivery_delays_desc: 'Theo dõi các đơn hàng đã ship nhưng quá lâu chưa cập nhật trạng thái Delivered.',
    cap_get_provider_tracking: 'Tra cứu Tracking trực tiếp',
    cap_get_provider_tracking_desc: 'Kết nối API trực tiếp với CustomCat, Merchize, Pentifine để lấy tracking gốc.',
    cap_summarize_telegram: 'Tổng hợp tin nhắn Telegram',
    cap_summarize_telegram_desc: 'Tóm tắt nội dung chat trong các nhóm kết nối giữa khách hàng và team vận hành.',
    cap_analyze_sentiment: 'Phân tích thái độ khách hàng',
    cap_analyze_sentiment_desc: 'Sử dụng AI để nhận diện cảm xúc (vui vẻ, giận dữ, khiếu nại) từ tin nhắn.',
    cap_member_lookup: 'Tra cứu thành viên nhóm',
    cap_member_lookup_desc: 'Lấy thông tin profile, username và lịch sử tham gia của khách hàng trên Telegram.',
    cap_calculate_payroll: 'Tính lương & Phụ cấp',
    cap_calculate_payroll_desc: 'Tự động tính toán lương thực lĩnh dựa trên ngày công, bảo hiểm và các khoản phụ cấp.',
    cap_revenue_report: 'Báo cáo doanh thu & Chi phí',
    cap_revenue_report_desc: 'Tổng hợp dòng tiền, lợi nhuận gộp và chi phí vận hành hệ thống theo kỳ báo cáo.',
    cap_attendance_tracking: 'Quản lý chấm công',
    cap_attendance_tracking_desc: 'Truy xuất dữ liệu check-in/out và tổng hợp ngày công thực tế của nhân viên.',
    cap_product_seo_title: 'Tối ưu Tiêu đề SEO',
    cap_product_seo_title_desc: 'Tự động tạo tiêu đề sản phẩm chuẩn SEO cho Etsy, Amazon, Shopify.',
    cap_product_description: 'Viết mô tả sáng tạo',
    cap_product_description_desc: 'Viết mô tả bán hàng thu hút theo phong cách storytelling hoặc benefit-driven.',
    cap_social_media_hooks: 'Viral Content Hooks',
    cap_social_media_hooks_desc: 'Tạo tiêu đề thu hút cho TikTok, Reels và bài đăng Facebook.',
    cap_ad_copy_gen: 'Nội dung quảng cáo PR',
    cap_ad_copy_gen_desc: 'Viết nội dung chạy quảng cáo Facebook/Google chuẩn marketing.',
    adminMarketingTitle: 'Marketing Hub',
    adminMarketingSubtitle: 'TỔNG HỢP CHIẾN DỊCH, NỘI DUNG SÁNG TẠO VÀ XU HƯỚNG THỊ TRƯỜNG',
    nicheAnalysis: 'Phân tích Niche',
    contentLibrary: 'Kho nội dung sáng tạo',
    trendingNiches: 'Niche đang thịnh hành',
    growth: 'Tăng trưởng',
    copyContent: 'Sao chép nội dung'
  },
  en: {
    // Sidebar & Navigation
    nexusChat: 'Nexus Conversation',
    prodManagement: 'Production Mgt',
    prodTime: 'Production Timeline',
    cskh: 'Customer Support',
    teleData: 'Telegram Analytics',
    accHr: 'HR & Accounting',
    payroll: 'Staff Payroll',
    marketingMgt: 'Marketing Mgt',
    creativeAsset: 'Creative Assets',
    sysAdmin: 'System Admin',
    accManagement: 'Account Control',
    logout: 'Sign Out System',
    profile: 'User Profile',

    // TopBar
    searchPlaceholder: 'Search for data...',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    langVi: 'Tiếng Việt',
    langEn: 'English',

    // Chat
    chatPlaceholder: 'Type your message...',
    agentThinking: 'Agent is thinking...',
    botGreeting: 'Welcome back! How can I help you today?',
    newUserGreeting: 'Welcome! How can I assist you with the Agent Ecosystem today?',
    typing: 'typing...',
    welcome: 'Welcome',

    // Common
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    loading: 'Loading...',
    noData: 'No data found.',
    createdAt: 'Created At',

    // Admin Users
    adminUsersTitle: 'Account Management',
    adminUsersSubtitle: 'USER LIST & SYSTEM ROLE ASSIGNMENT',
    username: 'Account',
    role: 'Role',
    telegramId: 'Telegram ID',
    joinDate: 'Joined Date',
    active: 'Active',
    suspended: 'Suspended',
    notLinked: 'Not linked',
    editUserTitle: 'User Config:',
    userRole: 'User',
    adminRole: 'Admin',
    accountStatus: 'Account Status',
    save: 'Save Changes',
    cancel: 'Cancel',
    deleteAdminError: 'Cannot delete root admin!',
    deleteConfirm: 'Are you sure you want to delete user',
    deleteError: 'Delete failed',

    // Admin Telegram
    adminTeleTitle: 'Telegram Data',
    adminTeleSubtitle: 'MONITORING NEXUS ACTIVITY ACROSS BUSINESS GROUPS',
    groupName: 'Group / Chat Name',
    category: 'Category',
    lastUpdate: 'Last Updated',
    members: 'Members',
    lastActive: 'Last Active',
    viewDetails: 'View Details',
    noGroups: 'No groups yet. Please add bot to Telegram and send message.',
    backToGroups: 'Back to Group List',
    memberDetails: 'Member Details',
    interactionHistory: 'Interaction History',
    noHistory: 'No interaction history available.',
    viewMembers: 'View Members',
    membersOf: 'Members:',
    back: 'Back',
    displayName: 'Display name',
    lastInteraction: 'Last Interaction',
    noMembers: 'No members recorded in this group besides Bot.',

    // Admin Employees
    adminEmpTitle: 'HR Management',
    adminEmpSubtitle: 'OPERATING SYSTEM & RESOURCE ADMINISTRATION',
    empName: 'Full Name',
    position: 'Position',
    department: 'Team',
    salary: 'Base Salary',
    allowance: 'Allowance',
    noEmpData: 'No employee data found.',
    syncNexus: 'Synchronizing from Nexus Core...',
    editEmp: 'Edit Employee:',
    empPosition: 'Position',
    contractSalary: 'Contract Salary',
    allowanceFuel: 'Fuel/Phone Allowance',
    allowanceMeal: 'Meal Allowance',
    allowanceOther: 'Other Allowance',
    posDirector: 'Director',
    posSales: 'Sales Representative',
    posDev: 'Software Engineer',
    posAccountant: 'Accountant',
    posProd: 'Production Staff',
    posMarketing: 'Marketing specialist',

    // Admin Production
    adminProdTitle: 'Production Core',
    adminProdSubtitle: 'CUSTOMIZE AGENT SYSTEM PARAMETERS (KERNEL V1.0)',
    minEstimate: 'MIN ESTIMATE',
    maxEstimate: 'MAX ESTIMATE',
    synchronize: 'SYNCHRONIZE SYSTEM',
    days: 'DAYS',
    stable: 'STABLE',
    fast: 'FAST',
    ready: 'READY',
    systemNodes: 'SYSTEM NODES',
    avgLatency: 'AVG LATENCY',
    agentSync: 'AGENT SYNC',
    logicAnalysis: 'LOGIC NEURAL ANALYSIS',
    prodLogicInfo: 'These production times are injected directly into the Agent System Prompt.',
    prodLogicNote: '* Note: Algorithms automatically bypass holidays and weekends.',
    prodLogicFormula: 'Agent calculates: [Sent to Print] + [Config Days] = [Expected Delivery Date].',

    // User Profile
    profileTitle: 'User Profile',
    personalInfo: 'Personal Information',
    security: 'Security & System',
    updated_at: 'Updated:',
    synchronized: 'Synchronized!',
    saveChanges: 'Save Changes',
    changePassword: 'Change Password',
    profileUpdateSuccess: 'Information has been updated on Nexus Core system.',
    saving: 'Saving...',
    password: 'Password',
    loginSystem: 'Log In System',
    createAccount: 'Create Account',
    speechNotSupported: 'Browser does not support Speech Recognition. Please use Chrome.',
    listening: 'Listening...',
    handsFreeLabel: 'HANDS-FREE',
    liveLabel: 'LIVE',
    handsFreeOff: 'Hands-free Off',
    handsFreeOn: 'Hands-free On',
    handsFreeActive: 'Hands-free active...',
    handsFree: 'Hands-free',
    ttsOff: 'TTS Off',
    ttsOn: 'TTS On',

    // Auth
    login: 'Log In',
    register: 'Register',
    welcomeBack: 'Welcome Back',
    getStarted: 'Get Started',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loadingHistory: 'Loading conversation history...',
    updateError: 'Update failed!',
    loadHistoryError: 'Failed to load chat history.',
    updateProdError: 'Production update failed!',
    connError: 'Lost connection to production server (EFS Node 1).',
    agentSettings: 'Agent Settings',
    adminAgentSettingsTitle: 'Agent Skills Management',
    adminAgentSettingsSubtitle: 'CONFIGURE FEATURES AND ACCESS PERMISSIONS FOR EACH BOT',
    capability: 'Skill / Tool',
    access: 'Access Permission',
    everyone: 'Everyone',
    onlyAdmin: 'Admin Only',
    agentCapabilities: 'Skills List',
    providerKeysTitle: 'Provider API Keys Config',
    providerKeysSubtitle: 'MANAGE DIRECT ACCESS KEYS FOR PRODUCTION PARTNER',
    modelApiKey: 'Model API Key',
    modelApiUrl: 'Model API URL',
    defaultModel: 'Default AI Model',
    telegramToken: 'Telegram Bot Token',
    elevenKey: 'ElevenLabs API Key',
    voiceId: 'ElevenLabs Voice ID',
    elevenModelId: 'ElevenLabs Model ID',
    customCatKey: 'CustomCat API Key',
    pentifineKey: 'Pentifine API Key',
    merchizeKey: 'Merchize API Key',
    keyPlaceholder: 'Enter new API key or leave blank to keep current...',
    updateSuccess: 'Updated successfully!',
    agent_production: 'Production Agent',
    agent_production_desc: 'Production coordinator, order lookup and provider tracking specialist.',
    agent_cskh: 'CSKH Agent',
    agent_cskh_desc: 'Handles customer inquiries, shipping status checks and member info.',
    agent_accounting: 'Accounting Agent',
    agent_accounting_desc: 'Manages payroll, financial reconciliation and operational costs.',
    agent_marketing: 'Marketing Agent',
    agent_marketing_desc: 'Content creation specialist, SEO title optimization and multi-channel ad copy.',
    cap_get_efs_order_info: 'EFS Order Lookup',
    cap_get_efs_order_info_desc: 'Extracts detailed product, status and history from EFS core.',
    cap_get_pending_orders: 'List Pending Orders',
    cap_get_pending_orders_desc: 'Lists orders waiting for processing or in production by status.',
    cap_search_shop_info: 'Shop Search',
    cap_search_shop_info_desc: 'Finds owners, management teams and operational status of shops.',
    cap_get_production_bottlenecks: 'Production Bottlenecks Report',
    cap_get_production_bottlenecks_desc: 'Detects overdue orders without tracking information.',
    cap_get_delivery_delays: 'Delivery Delays Report',
    cap_get_delivery_delays_desc: 'Monitors shipped orders that are taking too long to be delivered.',
    cap_get_provider_tracking: 'Direct Provider Tracking',
    cap_get_provider_tracking_desc: 'Connects directly to CustomCat, Merchize, Pentifine APIs for original tracking.',
    cap_summarize_telegram: 'Telegram Message Summary',
    cap_summarize_telegram_desc: 'Summarizes chat content in groups between customers and operations team.',
    cap_analyze_sentiment: 'Customer Sentiment Analysis',
    cap_analyze_sentiment_desc: 'Uses AI to detect emotions (happy, angry, complaints) from messages.',
    cap_member_lookup: 'Member Lookup',
    cap_member_lookup_desc: 'Retrieves profile info, username and participation history on Telegram.',
    cap_calculate_payroll: 'Payroll & Allowance Calculation',
    cap_calculate_payroll_desc: 'Automatically calculates net pay based on field days, insurance and allowances.',
    cap_revenue_report: 'Revenue & Cost Report',
    cap_revenue_report_desc: 'Summarizes cash flow, gross profit and operational costs for reporting periods.',
    cap_attendance_tracking: 'Attendance Tracking',
    cap_attendance_tracking_desc: 'Retrieves check-in/out data and summarizes actual working days for employees.',
    cap_product_seo_title: 'SEO Title Optimization',
    cap_product_seo_title_desc: 'Generates SEO-friendly product titles for Etsy, Amazon, and Shopify.',
    cap_product_description: 'Creative Description',
    cap_product_description_desc: 'Writes engaging product descriptions focusing on benefits and storytelling.',
    cap_social_media_hooks: 'Viral Content Hooks',
    cap_social_media_hooks_desc: 'Creates catchy hooks for TikTok, Reels, and Facebook posts.',
    cap_ad_copy_gen: 'Ad Copy Generation',
    cap_ad_copy_gen_desc: 'Writes marketing ad copies for Facebook and Google Ads campaigns.',
    adminMarketingTitle: 'Marketing Hub',
    adminMarketingSubtitle: 'CAMPAIGN FEED, CREATIVE ASSETS AND MARKET TRENDS',
    nicheAnalysis: 'Niche Analysis',
    contentLibrary: 'Content Library',
    trendingNiches: 'Trending Niches',
    growth: 'Growth',
    copyContent: 'Copy content'
  }
};
