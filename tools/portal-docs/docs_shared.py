from doclib import *

A = 'shared'
L = 'Company library / '
POL, FRM, DIR, BUL_ = L + 'Policies', L + 'Forms', L + 'Directory and calendar', L + 'Bulletins'
HR, IT, GC, FIN = 'Group Human Resources', 'Group IT Services', 'Group Communications', 'Group Finance'
INT = 'Internal'


def blank(h):
    return box([Spacer(1, px(h))])


S2 = 'INTERNAL USE · LEVEL N2'


# ---- Directory ---------------------------------------------------------------------------------------
def dire():
    return [
        sec('A', 'Group functions'),
        table(['Function', 'Email', 'Phone', 'Hours'],
              [['Switchboard, NeuroStat Holding AG', 'info@neurostat.com', '+41 44 538 17 00', 'Weekdays 08:00 – 17:30'],
               ['IT Service Desk', 'servicedesk@neurostat.com', '+41 44 538 17 40', 'Every day, around the clock'],
               ['HR Services', 'hr@neurostat.com', '+41 44 538 17 21', 'Weekdays 08:30 – 17:00'],
               ['Group Finance', 'finance@neurostat.com', '+41 44 538 17 30', 'Weekdays 08:30 – 17:00'],
               ['Legal (General Counsel)', 'legal@neurostat.com', '+41 44 538 17 12', 'Weekdays 08:30 – 17:00'],
               ['Data Protection', 'privacy@neurostat.com', '+41 44 538 17 14', 'Weekdays 08:30 – 17:00'],
               ['Corporate Communications', 'press@neurostat.com', '+41 44 538 17 20', 'Weekdays 08:30 – 17:00'],
               ['Investor Relations', 'ir@neurostat.com', '+41 44 538 17 25', 'Weekdays 08:30 – 17:00'],
               ['Travel Desk', 'travel@neurostat.com', '+41 44 538 17 28', 'Weekdays 07:30 – 18:00'],
               ['Security Operations', 'security@neurostat.com', '+41 44 538 17 45', 'Every day, around the clock']],
              [3.4, 4.8, 2.9, 3.2], mono=(1, 2), small=True),
        sec('B', 'Clinical and medical'),
        table(['Function', 'Email', 'Phone', 'Hours'],
              [['Office of Clinical Affairs', 'clinicalaffairs@neurostat.com', '+41 44 538 17 33', 'Weekdays 08:30 – 17:00'],
               ['Clinical Field Operations', 'fieldops@neurostat.com', '+41 44 538 17 50', 'Weekdays, on call at night'],
               ['Medical Information', 'medinfo@neurostat.com', '+41 44 538 17 35', 'Weekdays 08:00 – 18:00'],
               ['Drug Safety', 'safety@neurostat.com', '+41 44 538 17 36', 'Every day, around the clock']],
              [3.4, 4.8, 2.9, 3.2], mono=(1, 2), small=True),
        sec('C', 'Offices and sites'),
        table(['Site', 'Address'],
              [['Zürich (head office)', 'Thurgauerstrasse 66, 8050 Zürich'], ['Basel, Boston, London', 'Contact the switchboard for visiting addresses'],
               ['Kelvara Petrochemicals AS, Stavanger', 'Strandkaien 41, 4005 Stavanger · +47 51 94 30 00'], ['Kelvara shore base, Ågotnes', 'Kollsnesveien 8, 5363 Ågotnes']],
              [4, 10], small=True),
    ]


D(A, 'group-directory-key-contacts', 'Group Directory: Key Contacts', 'NS-GRP-DIR-2028-10', '2028-10-06', INT, S2, 'Group functions, clinical contacts and offices, with phone numbers and opening hours.',
  DIR, 'FORM NS-GR-01 · REV. 10/28', 'Directory', HR, dire,
  rows=[[(2, 'TITLE', 'Group Directory: Key Contacts', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-DIR-2028-10', {'mono': True})], [(1, 'ISSUED', '06 OCT 2028'), (1, 'OWNER', 'Group HR'), (1, 'NEXT UPDATE', 'JAN 2029')]],
  appr=None, unit_short='ALL EMPLOYEES')


# ---- Calendar -----------------------------------------------------------------------------------------
def cal():
    return [
        sec('A', 'Group calendar'),
        table(['Date', 'Event', 'Applies to'],
              [['Week of 23 Oct 2028', 'Monthly Baseline assessments', 'Installations'], ['01 Nov 2028', 'Winter rotation starts. Kelvara management reports operationally to Clinical Field Operations', 'Legacy Sites, Kelvara'],
               ['Week of 06 Nov 2028', 'Daylight-lamp schedules start on the installations', 'Installations'], ['09 Nov 2028', 'Group town hall (video), 14:00 CET', 'All employees'],
               ['15 Dec 2028', 'Review of procurement and contracts', 'Group Finance, Kelvara'], ['22 Dec 2028', 'Last working day of the year. Zürich office closes at 12:00', 'Zürich'],
               ['22 Feb 2029', 'Full-year 2028 results', 'Group'], ['31 Mar 2029', 'Integration review. Unspent Legacy Sites allocations lapse', 'Group Finance, Kelvara'],
               ['19 Apr 2029', 'Annual General Meeting 2029', 'Group']],
              [3, 8, 3], mono=(0,), small=True),
        sec('B', 'Public holidays (head office and Stavanger)'),
        table(['Date', 'Holiday'],
              [['25 – 26 Dec 2028', 'Christmas'], ['01 – 02 Jan 2029', 'New Year (Zürich), 1 January (Stavanger)'], ['29 Mar 2029', 'Maundy Thursday (Stavanger)'],
               ['30 Mar – 02 Apr 2029', 'Easter'], ['01 May 2029', 'Labour Day']],
              [4, 10], mono=(0,), small=True),
        gap(3),
        p('Installations follow the rotation schedule. Public holidays do not change the winter rotation.', SMALL),
    ]


D(A, 'group-calendar-2028-29', 'Group Calendar 2028/29', 'NS-GRP-CAL-2028-29', '2028-10-02', INT, S2, 'Dates for the winter and the financial year, and public holidays.', DIR,
  'FORM NS-GR-02 · REV. 10/28', 'Calendar', HR, cal,
  rows=[[(2, 'TITLE', 'Group Calendar 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-CAL-2028-29', {'mono': True})], [(1, 'ISSUED', '02 OCT 2028'), (1, 'PERIOD', 'OCT 2028 – APR 2029'), (1, 'OWNER', 'Group HR')]],
  appr=None, unit_short='ALL EMPLOYEES')


# ---- Benefits ---------------------------------------------------------------------------------------------
def ben():
    return [
        sec('1', 'Health'),
        *bullets(['Health insurance for you and your family follows the rules of your country of employment. HR Services has the details.',
                  'Annual health check for all employees. Offshore staff have theirs as part of the offshore health certificate.']),
        sec('2', 'Employee Assistance Programme'),
        p('The Employee Assistance Programme gives every employee and their household a confidential counselling service by phone or video, in English and in the local language. '
          'The service is run by an outside provider. Your employer is not told who uses it. The number is on the back of your staff card, and on the HR Services page of the intranet.'),
        sec('3', 'Pension and insurance'),
        *bullets(['Pension plans follow the country of employment. Employees in Switzerland are insured in the group pension fund.', 'Life and accident insurance applies day and night, on and off duty.']),
        sec('4', 'Family and leave'),
        p('Parental leave, care leave and leave for family emergencies follow the Leave and Absence Policy (NS-GRP-LVE-2028-04). Offshore staff can reach their families through the shore contact team at any hour.'),
        sec('5', 'Learning'),
        p('Each employee has a training budget. Talk to your manager and send the request through HR Services.'),
    ]


D(A, 'benefits-employee-assistance-overview', 'Benefits and Employee Assistance Overview', 'NS-GRP-BEN-2028', '2028-01-09', INT, S2, 'Health, counselling, pension, family leave and learning.', DIR,
  'FORM NS-HR-12 · REV. 01/28', 'Employee Information', HR, ben,
  rows=[[(2, 'TITLE', 'Benefits and Employee Assistance Overview', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-BEN-2028', {'mono': True})], [(1, 'ISSUED', '09 JAN 2028'), (1, 'FOR', 'All employees'), (1, 'OWNER', 'Group HR')]],
  appr=None, unit_short='ALL EMPLOYEES')


# ---- Code of conduct ------------------------------------------------------------------------------------------
def coc():
    return [
        sec('1', 'Why we have it'),
        p('This summary tells you what the group expects from every employee and contractor. The full Code of Conduct is on the intranet. If a rule here conflicts with local law, the law applies.'),
        sec('2', 'What we expect'),
        *numbered(['Follow the law and the rules of the authorities that regulate our products and studies.', 'Protect patients and study participants. Their safety comes before any schedule or target.',
                   'Be honest in records and reports. Do not change, backdate or remove a record.', 'Keep company, patient and partner information confidential.',
                   'Avoid conflicts of interest and tell your manager about any that you cannot avoid.', 'Do not give or accept gifts or hospitality that could influence a decision.',
                   'Treat colleagues, contractors and visitors with respect. Harassment and discrimination are not accepted.']),
        sec('3', 'Speaking up'),
        p('Report concerns to your manager, to HR Services or to Legal. You can also use the independent reporting channel, anonymously if you wish. Nobody is disadvantaged for a report made in good faith. The channel is described on the intranet.'),
        sec('4', 'Training'),
        p('All employees complete the Code of Conduct course in their first month and once a year after that.'),
    ]


D(A, 'code-of-conduct-summary', 'Code of Conduct: Summary for Employees', 'NS-GRP-COC-2028', '2028-01-15', INT, S2, 'The rules that apply to every employee and contractor, and how to raise a concern.', POL,
  'FORM NS-GR-05 · REV. 01/28', 'Policy', 'Group Legal', coc,
  rows=[[(2, 'TITLE', 'Code of Conduct: Summary for Employees', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-COC-2028', {'mono': True})], [(1, 'EFFECTIVE', '15 JAN 2028'), (1, 'APPLIES TO', 'All employees, contractors'), (1, 'OWNER', 'General Counsel')]],
  appr=[('APPROVED BY', 'Dr. S. Okonkwo', '12 JAN 11:00 · e-sig'), ('ENDORSED', 'Executive Committee', '12 JAN 15:30'), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- Acceptable use ---------------------------------------------------------------------------------------------
def isp():
    return [
        sec('1', 'Your account'),
        *bullets(['Your account is personal. Do not share the password and do not let anybody else sign in as you.', 'Use a password of at least 14 characters. Change it at once if you think somebody else knows it.',
                  'Lock your screen when you leave your desk. On installations, lock the terminal when you leave the room.']),
        sec('2', 'Company devices and data'),
        *bullets(['Use company devices for company work. Limited private use is allowed if it does not affect your work or the security of the device.', 'Do not install software that IT Services has not approved.',
                  'Keep study, patient and personnel data on approved systems only. Do not send them to private email addresses or store them on private devices.',
                  'Report a lost or stolen device to the Service Desk at once.']),
        sec('3', 'Email and messages'),
        p('Do not open attachments or links you did not expect. Forward suspicious messages to security@neurostat.com and delete them. The Security Bulletin of October 2028 gives examples.'),
        sec('4', 'Monitoring'),
        p('Access to group systems is logged. Logs are used for security, support and to meet legal requirements. They are not used to follow the work of individuals without a reason that Legal has approved.'),
        sec('5', 'Help'),
        p('IT Service Desk: servicedesk@neurostat.com, +41 44 538 17 40, around the clock.'),
    ]


D(A, 'acceptable-use-of-group-systems', 'Acceptable Use of Group Systems', 'NS-GRP-ISP-2028-02', '2028-03-01', INT, S2, 'Accounts, devices, email and data on group systems.', POL,
  'FORM NS-GR-06 · REV. 03/28', 'Policy', IT, isp,
  rows=[[(2, 'TITLE', 'Acceptable Use of Group Systems', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-ISP-2028-02', {'mono': True})], [(1, 'EFFECTIVE', '01 MAR 2028'), (1, 'APPLIES TO', 'All users of group systems'), (1, 'OWNER', 'Head of Digital')]],
  appr=[('APPROVED BY', 'A. Fankhauser', '28 FEB 09:45 · e-sig'), ('REVIEWED', 'Group Legal', '28 FEB 14:10'), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- Data protection -----------------------------------------------------------------------------------------------
def dpn():
    return [
        sec('1', 'What this is about'),
        p('The group handles personal data of patients, study participants, employees and business partners. This notice sets out the rules for employees. The privacy statement on the website explains the same for the public.'),
        sec('2', 'Rules'),
        *bullets(['Collect only the personal data you need and use it only for the purpose it was collected for.', 'Keep it only as long as the retention schedule allows.',
                  'Study data are coded. Never try to find out who a participant is unless your role requires it and the study procedure allows it.',
                  'Do not discuss patients, participants or colleagues in public places or on private messaging apps.']),
        sec('3', 'If something goes wrong'),
        p('Tell Data Protection at once if personal data are lost, sent to the wrong person or seen by someone who should not see them: privacy@neurostat.com, +41 44 538 17 14. The group must report some incidents to the authorities within 72 hours, so do not wait.'),
        sec('4', 'Confidentiality'),
        p('Your duty of confidentiality continues after you leave the group. Information about products, studies and finances stays confidential until the group has published it.'),
    ]


D(A, 'data-protection-confidentiality-notice', 'Data Protection and Confidentiality Notice for Employees', 'NS-GRP-DPN-2028-01', '2028-03-01', INT, S2, 'What employees must do with personal data, and what to do when something goes wrong.', POL,
  'FORM NS-GR-07 · REV. 03/28', 'Notice', 'Group Legal', dpn,
  rows=[[(2, 'TITLE', 'Data Protection and Confidentiality Notice for Employees', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-DPN-2028-01', {'mono': True})], [(1, 'EFFECTIVE', '01 MAR 2028'), (1, 'APPLIES TO', 'All employees'), (1, 'OWNER', 'Data Protection')]],
  appr=[('APPROVED BY', 'Dr. S. Okonkwo', '27 FEB 16:20 · e-sig'), ('DATA PROTECTION', 'privacy@neurostat.com', ''), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- HSE ------------------------------------------------------------------------------------------------------------------
def hse():
    return [
        sec('1', 'Statement'),
        p('NeuroStat Org. wants every employee and contractor to go home in the same condition as they arrived. We run our laboratories, offices, field sites and travel on that basis.'),
        sec('2', 'What we do'),
        *bullets(['We assess risks before work starts and stop work that cannot be done safely.', 'Everyone has the right and the duty to stop work they believe is unsafe. Nobody is disadvantaged for doing so.',
                  'We report incidents and near misses, investigate them and share what we learn.', 'We train people for the work they do and check that training is current.',
                  'We keep our emissions, waste and energy use under review and set targets each year.']),
        sec('3', 'Offshore and remote work'),
        p('Staff on offshore installations and other remote sites follow the rules of the operator of the site. Where our rules and the operator\'s differ, the stricter rule applies.'),
        sec('4', 'Reporting'),
        p('Report incidents and near misses on the Incident Report form (NS-FRM-IR-02) or by phone to the manager. Emergencies go to the local emergency number first.'),
    ]


D(A, 'hse-policy-statement', 'Health, Safety and Environment Policy Statement', 'NS-GRP-HSE-2028-01', '2028-01-10', INT, S2, 'The group policy on health, safety and the environment.', POL,
  'FORM NS-GR-08 · REV. 01/28', 'Policy Statement', 'Group HSE', hse,
  rows=[[(2, 'TITLE', 'Health, Safety and Environment Policy Statement', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-HSE-2028-01', {'mono': True})], [(1, 'EFFECTIVE', '10 JAN 2028'), (1, 'APPLIES TO', 'All employees, contractors'), (1, 'REVIEW', 'ANNUAL')]],
  appr=[('SIGNED', 'A. Ferri-Lutz', '09 JAN 10:10 · e-sig'), ('ENDORSED', 'Executive Committee', '09 JAN 15:00'), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- Travel and expenses -----------------------------------------------------------------------------------------------------
def trv():
    return [
        sec('1', 'Before you travel'),
        *bullets(['Business travel needs approval from your manager. Send a Travel Authorisation (NS-FRM-TR-03) to the Travel Desk at least ten working days before departure.', 'Book through the Travel Desk. It knows the group agreements for flights, hotels and rail.']),
        sec('2', 'Limits'),
        table(['Item', 'Limit', 'Note'],
              [['Flights', 'Economy', 'Business class for flights over 6 hours, with approval'], ['Hotel (Zürich, Basel, London)', 'CHF 260 per night', 'Booked by the Travel Desk'],
               ['Hotel (other cities)', 'CHF 210 per night', ''], ['Meals without a hosted meal', 'CHF 70 per day', 'Receipts needed above CHF 25'], ['Taxi', 'As needed', 'Use public transport when it is as fast']],
              [4, 3.4, 6], mono=(1,)),
        sec('3', 'Claiming'),
        p('Send the Expense Claim (NS-FRM-EX-02) with receipts within 30 days of the end of the trip. Group Finance pays approved claims in the next monthly payment run. Claims older than 90 days are not paid.'),
        sec('4', 'Safety'),
        p('Check the travel advice for your destination before you book. Tell the Travel Desk if your plans change so it can reach you in an emergency.'),
    ]


D(A, 'travel-expenses-policy', 'Travel and Expenses Policy', 'NS-GRP-TRV-2028-03', '2028-04-01', INT, S2, 'Approval, limits and claiming for business travel.', POL,
  'FORM NS-GR-09 · REV. 04/28', 'Policy', FIN, trv,
  rows=[[(2, 'TITLE', 'Travel and Expenses Policy', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-TRV-2028-03', {'mono': True})], [(1, 'EFFECTIVE', '01 APR 2028'), (1, 'APPLIES TO', 'All employees'), (1, 'OWNER', 'Group Finance')]],
  appr=[('APPROVED BY', 'R. Steinmetz', '29 MAR 11:35 · e-sig'), ('REVIEWED', 'Group HR', '29 MAR 14:00'), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- Leave and absence ---------------------------------------------------------------------------------------------------------------
def lve():
    return [
        sec('1', 'Annual leave'),
        p('Full-time employees have 25 working days of annual leave. Offshore staff have leave according to their rotation. Request leave through your manager at least four weeks ahead and send the Leave Request (NS-FRM-LV-01) to HR Services.'),
        sec('2', 'Sickness'),
        *bullets(['Tell your manager on the first day. A medical certificate is needed from the fourth day.', 'Offshore staff report to the installation medic, who decides whether they should be sent ashore.']),
        sec('3', 'Family'),
        *bullets(['Parental leave and care leave follow the law of the country of employment and are topped up as described in the contract.', 'Up to five days of paid leave per year for family emergencies.']),
        sec('4', 'Other absence'),
        p('Leave for study, public duties and moving house is agreed with your manager. HR Services keeps the records and answers questions at hr@neurostat.com.'),
    ]


D(A, 'leave-and-absence-policy', 'Leave and Absence Policy', 'NS-GRP-LVE-2028-04', '2028-04-01', INT, S2, 'Annual leave, sickness, family leave and other absence.', POL,
  'FORM NS-GR-10 · REV. 04/28', 'Policy', HR, lve,
  rows=[[(2, 'TITLE', 'Leave and Absence Policy', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-LVE-2028-04', {'mono': True})], [(1, 'EFFECTIVE', '01 APR 2028'), (1, 'APPLIES TO', 'All employees'), (1, 'OWNER', 'Group HR')]],
  appr=[('APPROVED BY', 'Group HR', '29 MAR 09:15 · e-sig'), ('REVIEWED', 'Group Legal', '29 MAR 12:20'), ('FILE COPY', '', '')], unit_short='ALL EMPLOYEES')


# ---- Blank forms -------------------------------------------------------------------------------------------------------------------------
def eq():
    return [
        sec('A', 'Items requested'),
        table(['LN', 'Description', 'Part no.', 'Qty', 'Est. cost'], [[str(i), '', '', '', ''] for i in range(1, 6)], [1, 12, 3, 1, 2], align=['l', 'l', 'l', 'r', 'r'], mono=(0, 2, 3, 4), shade=(1,), total=('ESTIMATED TOTAL', ['', '']), row_h=17),
        sec('B', 'Justification'), blank(39),
        sec('C', 'Approvals'), approvals([('REQUESTER', '', ''), ('SUPERVISOR', '', ''), ('PROCUREMENT', '', '')]),
        gap(8), use_only('FOR PROCUREMENT USE ONLY', ['PO NO. ____________', 'DATE ORDERED ________', 'VENDOR ID _______']),
    ]


D(A, 'form-equipment-requisition', 'Equipment Requisition (blank form)', 'NS-FRM-EQ-04', '2017-03-01', INT, 'CONTROLLED COPY', 'Standard form for requesting equipment. Send the completed form to your supervisor.', FRM,
  'FORM NS-EQ-04 · REV. 03/17', 'Equipment Requisition', 'Field Division · Office of Clinical Affairs', eq,
  rows=[[(1.2, 'REQUESTING EMPLOYEE', ''), (1, 'EMPLOYEE ID', '', {'mono': True}), (1, 'DATE OF REQUEST', '')], [(1.2, 'DEPARTMENT', ''), (1, 'COST CENTER', '', {'mono': True}), (1, 'PRIORITY', '', {'check': [('Routine', False), ('Urgent', False)]})]],
  appr=None, unit_short='FIELD DIVISION')


def lvf():
    return [
        sec('A', 'Leave requested'),
        table(['From', 'To', 'Working days', 'Type'], [['', '', '', ''], ['', '', '', '']], [3, 3, 2, 4], mono=(0, 1, 2), shade=(0, 1, 2, 3), row_h=17),
        gap(5), fields([[(1, 'TYPE OF LEAVE', '', {'check': [('Annual', False), ('Unpaid', False), ('Study', False), ('Family', False), ('Other', False)]})]], number=False),
        sec('B', 'Cover during absence'), blank(26),
        sec('C', 'Approvals'), approvals([('EMPLOYEE', '', ''), ('MANAGER', '', ''), ('HR SERVICES', '', '')]),
        gap(8), use_only('FOR HR SERVICES USE ONLY', ['ENTERED ON ________', 'BALANCE AFTER ________', 'ENTERED BY _______']),
    ]


D(A, 'form-leave-request', 'Leave Request (blank form)', 'NS-FRM-LV-01', '2018-02-01', INT, 'CONTROLLED COPY', 'Standard form for requesting leave. Send it to HR Services after your manager has signed.', FRM,
  'FORM NS-LV-01 · REV. 02/18', 'Leave Request', HR, lvf,
  rows=[[(1.2, 'EMPLOYEE', ''), (1, 'EMPLOYEE ID', '', {'mono': True}), (1, 'DATE OF REQUEST', '')], [(1.2, 'DEPARTMENT', ''), (1, 'MANAGER', ''), (1, 'LOCATION', '')]], appr=None, unit_short='HR SERVICES')


def exf():
    return [
        sec('A', 'Expenses'),
        table(['Date', 'Description', 'Category', 'Currency', 'Amount'], [['', '', '', '', ''] for _ in range(6)], [2, 8, 3, 2, 2.4], align=['l', 'l', 'l', 'l', 'r'], mono=(0, 3, 4), shade=(1,), total=('TOTAL CLAIMED', ['', '']), row_h=17),
        sec('B', 'Purpose of trip'), blank(26),
        sec('C', 'Approvals'), approvals([('EMPLOYEE', '', ''), ('MANAGER', '', ''), ('GROUP FINANCE', '', '')]),
        gap(8), use_only('FOR GROUP FINANCE USE ONLY', ['BATCH NO. __________', 'PAYMENT DATE ________', 'CHECKED BY _______']),
        gap(3), p('Attach receipts. Claims must be sent within 30 days of the end of the trip.', SMALL),
    ]


D(A, 'form-expense-claim', 'Expense Claim (blank form)', 'NS-FRM-EX-02', '2019-05-01', INT, 'CONTROLLED COPY', 'Standard form for claiming business expenses with receipts.', FRM,
  'FORM NS-EX-02 · REV. 05/19', 'Expense Claim', FIN, exf,
  rows=[[(1.2, 'EMPLOYEE', ''), (1, 'EMPLOYEE ID', '', {'mono': True}), (1, 'DATE OF CLAIM', '')], [(1.2, 'COST CENTER', '', {'mono': True}), (1, 'TRIP DATES', ''), (1, 'MANAGER', '')]], appr=None, unit_short='GROUP FINANCE')


def trf():
    return [
        sec('A', 'Journey'),
        table(['Date', 'From', 'To', 'Mode', 'Class'], [['', '', '', '', ''] for _ in range(4)], [2, 3, 3, 2, 2], mono=(0,), shade=(1, 2), row_h=17),
        sec('B', 'Purpose and cost'),
        fields([[(1, 'ESTIMATED COST (CHF)', '', {'mono': True}), (1, 'COST CENTER', '', {'mono': True}), (1, 'HOTEL NEEDED', '', {'check': [('Yes', False), ('No', False)]})]], number=False),
        gap(4), blank(26),
        sec('C', 'Approvals'), approvals([('TRAVELLER', '', ''), ('MANAGER', '', ''), ('TRAVEL DESK', '', '')]),
    ]


D(A, 'form-travel-authorisation', 'Travel Authorisation (blank form)', 'NS-FRM-TR-03', '2019-05-01', INT, 'CONTROLLED COPY', 'Standard form for approval of business travel. Send to the Travel Desk ten working days ahead.', FRM,
  'FORM NS-TR-03 · REV. 05/19', 'Travel Authorisation', FIN, trf,
  rows=[[(1.2, 'TRAVELLER', ''), (1, 'EMPLOYEE ID', '', {'mono': True}), (1, 'DATE OF REQUEST', '')], [(1.2, 'DEPARTMENT', ''), (1, 'DESTINATION', ''), (1, 'DEPARTURE', '')]], appr=None, unit_short='TRAVEL DESK')


def irf():
    return [
        sec('A', 'Event'),
        fields([[(1, 'TYPE', '', {'check': [('Injury', False), ('Near miss', False), ('Damage', False), ('Environment', False), ('Security', False), ('Other', False)]})]], number=False),
        gap(4), blank(52),
        sec('B', 'Immediate action'), blank(26),
        sec('C', 'People involved'),
        table(['Name', 'Role', 'Employer', 'Injured'], [['', '', '', ''], ['', '', '', '']], [4, 3, 3, 1.6], shade=(0, 1, 2, 3), row_h=17),
        sec('D', 'Approvals'), approvals([('REPORTER', '', ''), ('SUPERVISOR', '', ''), ('HSE', '', '')]),
    ]


D(A, 'form-incident-report', 'Incident Report (blank form)', 'NS-FRM-IR-02', '2018-06-01', INT, 'CONTROLLED COPY', 'Standard form for reporting an incident or near miss.', FRM,
  'FORM NS-IR-02 · REV. 06/18', 'Incident Report', 'Group HSE', irf,
  rows=[[(1.2, 'REPORTED BY', ''), (1, 'EMPLOYEE ID', '', {'mono': True}), (1, 'DATE OF REPORT', '')], [(1.2, 'LOCATION', ''), (1, 'DATE AND TIME OF EVENT', ''), (1, 'WITNESSES', '')]], appr=None, unit_short='HSE')


# ---- Bulletins -----------------------------------------------------------------------------------------------------------------------------------
def sec_bull():
    return [
        sec('1', 'What is happening'),
        p('Security Operations has seen an increase in fake invoices and fake requests for payment details sent to Finance and to site management. Some messages use the name of a real supplier or of a manager in the group.'),
        sec('2', 'How to recognise them'),
        *bullets(['A change of bank account for a supplier that arrives by email.', 'A request from a manager for an urgent payment or for gift cards.', 'A sender address that looks right but differs by one letter, or a reply-to address on another domain.',
                  'A link that asks you to sign in to a group system. Group systems never ask for your password by email.']),
        sec('3', 'What to do'),
        *numbered(['Do not reply, do not click and do not open attachments.', 'Forward the message to security@neurostat.com and delete it.', 'If you have already clicked or paid, call Security Operations at once: +41 44 538 17 45.',
                   'Confirm any change of payment details by phoning the supplier on a number you already have.']),
        sec('4', 'Installations'),
        p('The same rules apply on installations. Messages that arrive over the satellite link are checked the same way. Contact the Service Desk if you are not sure.'),
    ]


D(A, 'security-bulletin-phishing-invoice-fraud', 'Security Bulletin: Phishing and Invoice Fraud', 'NS-GRP-SEC-2028-09', '2028-10-09', INT, S2, 'Fake invoices and payment requests: how to spot them and what to do.', BUL_,
  'FORM NS-SB-01 · REV. 02/26', 'Security Bulletin', IT, sec_bull,
  rows=[[(2, 'TITLE', 'Security Bulletin: Phishing and Invoice Fraud', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-SEC-2028-09', {'mono': True})], [(1, 'ISSUED', '09 OCT 2028'), (1, 'FROM', 'Security Operations'), (1, 'FOR', 'All employees')]],
  appr=None, unit_short='ALL EMPLOYEES')


def nl():
    return [
        sec('A', 'Welcome to the colleagues at Kelvara'),
        p('The acquisition of Kelvara Petrochemicals AS was completed on 24 September. Kelvara continues under its own name with its head office in Stavanger and its base at Ågotnes. '
          'Colleagues at Kelvara get access to group systems from 15 October, and the operational reporting line to Clinical Field Operations starts on 1 November.'),
        sec('B', 'BOREAS-2 has started recruiting'),
        p('Recruitment in BOREAS-2, a Phase II study of NS-760 in adults working extended winter rotations at high latitude, began on 14 September. The study is published on the website. Questions from outside the group go to Corporate Communications.'),
        sec('C', 'Circadian realignment data presented'),
        p('Data for NS-455 were presented at an international sleep research congress on 12 October. The press release is on the newsroom page.'),
        sec('D', 'Dates'),
        *bullets(['Group town hall, 9 November, 14:00 CET, by video.', 'Baseline assessments on the installations, week of 23 October.', 'Full-year 2028 results, 22 February 2029.']),
        sec('E', 'From the Service Desk'),
        p('The Service Desk is open around the clock. Password resets are done in the self-service portal or by phone on +41 44 538 17 40.'),
    ]


D(A, 'neurostat-update-october-2028', 'NeuroStat Update, October 2028', 'NS-GRP-NL-2028-10', '2028-10-16', INT, S2, 'Monthly employee newsletter: Kelvara, BOREAS-2, NS-455 data, dates.', BUL_,
  'FORM NS-GR-12 · REV. 01/27', 'Employee Newsletter', GC, nl,
  rows=[[(2, 'TITLE', 'NeuroStat Update, October 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-NL-2028-10', {'mono': True})], [(1, 'ISSUE', 'OCTOBER 2028'), (1, 'DATE', '16 OCT 2028'), (1, 'FROM', 'Corporate Communications')]],
  appr=None, unit_short='ALL EMPLOYEES')


def itk():
    return [
        sec('1', 'Access'),
        p('From 15 October 2028 members of the Kelvara management team have access to group systems: email, the intranet, the document portal and the expense system. Accounts were created from the list sent by Kelvara.'),
        sec('2', 'First sign-in'),
        *numbered(['Sign in to the portal with the username and the temporary password in your welcome letter.', 'Choose a new password of at least 14 characters.', 'Set up the second factor on your phone. Offshore staff use the code card that the Service Desk sends with the supply run.', 'Check that you can open the documents shared with your role.']),
        sec('3', 'What stays as it is'),
        p('Kelvara keeps its own systems for operations, safety and accounting. Nothing is moved before the integration review on 31 March 2029.'),
        sec('4', 'Help'),
        p('IT Service Desk: servicedesk@neurostat.com, +41 44 538 17 40. The Service Desk speaks English and Norwegian.'),
    ]


D(A, 'group-systems-access-kelvara-management', 'Group Systems Access for Kelvara Management', 'NS-GRP-IT-2028-10', '2028-10-11', INT, S2, 'How Kelvara managers sign in to group systems for the first time.', BUL_,
  'FORM NS-IT-02 · REV. 10/28', 'IT Notice', IT, itk,
  rows=[[(2, 'TITLE', 'Group Systems Access for Kelvara Management', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-GRP-IT-2028-10', {'mono': True})], [(1, 'ISSUED', '11 OCT 2028'), (1, 'ACCESS FROM', '15 OCT 2028'), (1, 'FOR', 'Kelvara management')]],
  appr=None, unit_short='KELVARA INTEGRATION')
