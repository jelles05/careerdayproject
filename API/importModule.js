const LanguageManager = require('./src/managers/LanguageManager')
const dao = require('./src/managers/dao')
const SkillsManager = require('./src/managers/SkillsManager')
const MeetingManager = require('./src/managers/MeetingManager')
const ProvinceManager = require('./src/managers/ProvinceManager')
const CriteriaManager = require('./src/managers/CriteriaManager')
const CareerDayManager = require('./src/managers/CareerDayManager')
const UserManager = require('./src/managers/UserManager')
const EnterpriseManager = require('./src/managers/EntrepriseManager')
const EmployeeManager = require('./src/managers/EmplyeeManager')
const StudentManager = require('./src/managers/StudentManager')
const RoleManager = require('./src/managers/RoleManager')
const TimeSlotManager = require('./src/managers/TimeSlotManager')
const AttendanceManager = require('./src/managers/AttendanceManager')
const ProgramManager = require('./src/managers/ProgramManager')
const NotificationManager = require('./src/managers/NotificationManager')
const awsRoute = require('./src/rest-module/awsRoute')

module.exports = {
    LanguageManager,
    dao,
    SkillsManager,
    CriteriaManager,
    CareerDayManager,
    ProvinceManager,
    MeetingManager,
    UserManager,
    EnterpriseManager,
    EmployeeManager,
    StudentManager,
    RoleManager,
    TimeSlotManager,
    AttendanceManager,
    ProgramManager,
    NotificationManager,
    awsRoute
}
