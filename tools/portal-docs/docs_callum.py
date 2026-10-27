from doclib import *

A = 'callum'
CFO = 'Clinical Field Operations'
FIN = 'Group Finance'
PF = 'Production and finance'
STAFF = 'Staffing and procurement'


# ---- Integration plan -------------------------------------------------------------------------------
def integ():
    return [
        sec('1', 'Summary'),
        p('Following the acquisition of Kelvara Petrochemicals AS on 24 September 2028, Kelvara will continue as an independent operator under its own name. '
          'This plan describes how the company is integrated into the NeuroStat group over the first six months.'),
        sec('2', 'Principles'),
        *bullets(['Kelvara keeps its name, its head office in Stavanger and its base at Ågotnes.',
                  'Management and the organisation offshore and onshore remain unchanged.',
                  'Normal operations on Ødemark A continue. The winter rotation from 1 November goes ahead as planned.']),
        sec('3', 'Reporting line'),
        p('From 1 November 2028 the Kelvara management team reports operationally to Clinical Field Operations (Head: Marcus Holt). '
          'The Kelvara board continues to meet and receives reports on financial results.'),
        sec('4', 'Timeline'),
        table(['Date', 'Milestone', 'Owner'],
              [['24 Sep 2028', 'Completion of acquisition', 'General Counsel'],
               ['15 Oct 2028', 'Access to group systems for Kelvara management', 'IT'],
               ['01 Nov 2028', 'Operational reporting line to Clinical Field Operations', 'Clinical Field Operations'],
               ['15 Dec 2028', 'Review of procurement and contracts', 'Finance'],
               ['31 Mar 2029', 'Integration review', 'Executive Committee']],
              [2, 7, 3.4], mono=(0,)),
        sec('5', 'Communication'),
        p('Employees are informed by their line managers. External questions are referred to Corporate Communications.'),
    ]


D(A, 'post-acquisition-integration-plan', 'Post-Acquisition Integration Plan: Kelvara Petrochemicals AS', 'NS-CFO-INT-2028-09', '2028-09-29', 'Confidential, management',
  'CONFIDENTIAL · LEVEL N4', 'How Kelvara is integrated into the group over the first six months: principles, reporting line, timeline.', PF,
  'FORM NS-PL-02 · REV. 10/22', 'Integration Plan', CFO, integ,
  rows=[[(2, 'TITLE', 'Post-Acquisition Integration Plan: Kelvara Petrochemicals AS', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-INT-2028-09', {'mono': True})],
        [(1, 'PROJECT', 'Kelvara integration'), (1, 'COMPLETION', '24 SEP 2028'), (1, 'DATE', '29 SEP 2028'), (1, 'PERIOD', 'SIX MONTHS')]],
  appr=[('PREPARED BY', 'Clinical Field Operations', '29 SEP 16:48 · e-sig'), ('APPROVED', 'Executive Committee', '29 SEP 17:30'), ('FILE COPY', '', '')], unit_short='KELVARA INTEGRATION')


# ---- Production targets -------------------------------------------------------------------------------
def targets():
    return [
        sec('1', 'Targets'),
        table(['Period', 'Production (boepd)', 'Availability', 'Opex plan (CHF m)'],
              [['Q4 2028', '9,800', '94 %', '31.2'], ['Q1 2029', '9,600', '93 %', '32.0'], ['Q2 2029', '9,900', '95 %', '30.1']],
              [3, 3, 3, 3], align=['l', 'r', 'r', 'r'], mono=(1, 2, 3)),
        sec('2', 'Cost reduction'),
        p('The group target is a 6 percent reduction of operating cost on a full-year basis from 2029, compared with the 2028 budget. '
          'The reduction is to come from procurement, logistics and overhead.'),
        sec('3', 'Instruction'),
        p('Production is to be maintained at plan level throughout the winter rotation. Cost reductions must not reduce production availability or safety-critical maintenance. '
          'Where a cost measure and the production plan conflict, the production plan applies and the conflict is reported to Finance.'),
        sec('4', 'Reporting'),
        p('The Production Superintendent reports actual production and cost against the plan on the first working day of each month.'),
    ]


D(A, 'production-targets-cost-reduction', 'Production Targets and Cost Reduction, Winter 2028/29', 'NS-CFO-FIN-2028-10', '2028-10-09', 'Confidential, management',
  'CONFIDENTIAL · LEVEL N4', 'Production and opex targets for Q4 2028 to Q2 2029 and the 6 percent cost reduction.', PF,
  'FORM NS-FN-04 · REV. 08/23', 'Finance Instruction', FIN, targets,
  rows=[[(2, 'TITLE', 'Production Targets and Cost Reduction, Winter 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-FIN-2028-10', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'PERIOD', 'Q4 2028 – Q2 2029'), (1, 'DATE', '09 OCT 2028'), (1, 'TO', 'Production Superintendent')]],
  appr=[('ISSUED BY', 'R. Steinmetz', '09 OCT 08:50 · e-sig'), ('RECEIVED', '', ''), ('FILE COPY', '', '')], unit_short='FINANCE')


# ---- Cost-centre allocation -----------------------------------------------------------------------------
def alloc():
    return [
        sec('A', 'Allocation'),
        p('Programme: Legacy Sites. Cost centres allocated for the financial year 2028/29. Amounts in CHF thousand.'),
        table(['Cost centre', 'Installation', 'Cost category', 'Allocation', 'Notes'],
              [['LS-101', 'ØDM-A  Ødemark A', 'NOETIC-01', '1,240', 'Operations support'],
               ['LS-101', 'ØDM-A  Ødemark A', 'NOETIC-03', '860', 'Field standby'],
               ['LS-102', 'FAL-01', 'NOETIC-02', '710', ''],
               ['LS-103', 'RMM-02', 'NOETIC-01', '420', ''],
               ['LS-104', 'WIE-03', 'NOETIC-03', '1,090', 'Field standby'],
               ['LS-199', 'Programme', 'NOETIC-04', '2,300', 'Contract Cinza: reserved, not drawn']],
              [2, 3, 2.4, 2, 5], align=['l', 'l', 'l', 'r', 'l'], mono=(0, 2, 3), total=('TOTAL (CHF thousand)', ['6,620', ''])),
        sec('B', 'Handling'),
        *bullets(['Allocations for NOETIC categories are approved by Clinical Field Operations and booked centrally. Local management does not need to take action.',
                  'Unspent allocations lapse on 31 March 2029.']),
    ]


D(A, 'legacy-sites-cost-centre-allocation', 'Legacy Sites: Cost-Centre Allocation 2028/29', 'NS-CFO-FIN-2028-11', '2028-10-12', 'Confidential, management',
  'CONFIDENTIAL · LEVEL N4', 'Cost centres and allocations for the Legacy Sites programme, financial year 2028/29.', PF,
  'FORM NS-FN-05 · REV. 08/23', 'Cost Allocation', FIN, alloc,
  rows=[[(2, 'TITLE', 'Legacy Sites: Cost-Centre Allocation 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-FIN-2028-11', {'mono': True})],
        [(1, 'PROGRAMME', 'Legacy Sites'), (1, 'FINANCIAL YEAR', '2028/29'), (1, 'DATE', '12 OCT 2028'), (1, 'CURRENCY', 'CHF thousand')]],
  appr=[('PREPARED BY', 'Group Finance', '12 OCT 10:15 · e-sig'), ('APPROVED', 'Clinical Field Operations', '12 OCT 14:02'), ('FILE COPY', '', '')], unit_short='FINANCE')


# ---- Winter staffing review ---------------------------------------------------------------------------------
def staffing():
    return [
        sec('A', 'Personnel on board'),
        p('Basis: personnel on board (POB) planning for winter 2028/29, Ødemark A.'),
        table(['Function', 'Normal rotation', 'Winter plan', 'Change'],
              [['Operations and control room', '12', '12', '0'], ['Maintenance (mechanical, electrical, instrument)', '16', '16', '0'],
               ['Marine and deck', '9', '9', '0'], ['Catering and cabin services', '6', '6', '0'], ['Medical and radio', '2', '2', '0'],
               ['Management and HSE', '5', '5', '0']],
              [6, 2.4, 2.4, 1.6], align=['l', 'r', 'r', 'r'], mono=(1, 2, 3), total=('TOTAL', ['50', '50', '0'])),
        sec('B', 'Findings'),
        *bullets(['Winter manning is unchanged. The full season on board makes it important to avoid vacancies in medical, radio and catering functions.',
                  'Four offshore vacancies for winter 2028/29 have been filled. Recruitment for summer 2029 starts in January.',
                  'Overtime is expected to rise in January and February. A forecast is included in the cost review.']),
        sec('C', 'Recommendation'),
        p('Maintain the winter plan as it is. Review again after the first crew-health check in early December.'),
    ]


D(A, 'winter-staffing-review', 'Winter Staffing Review 2028/29: Ødemark A', 'NS-CFO-HR-2028-10', '2028-10-05', 'Internal, management',
  'INTERNAL USE · LEVEL N3', 'Personnel on board for the winter, by function, with findings and recommendation.', STAFF,
  'FORM NS-HR-07 · REV. 04/23', 'Staffing Review', CFO, staffing,
  rows=[[(2, 'TITLE', 'Winter Staffing Review 2028/29: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-HR-2028-10', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'PERIOD', 'WINTER 2028/29'), (1, 'DATE', '05 OCT 2028'), (1, 'TO', 'Site management')]],
  appr=[('PREPARED BY', 'Clinical Field Operations', '05 OCT 12:20 · e-sig'), ('REVIEWED', 'Group HR', '05 OCT 15:41'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Monthly production and cost report, September 2028 ----------------------------------------------------
def monthly():
    return [
        sec('A', 'Production'),
        table(['Measure', 'Plan', 'Actual', 'Variance'],
              [['Production (boepd, monthly average)', '9,700', '9,742', '+42'], ['Availability', '94.0 %', '94.6 %', '+0.6 pts'],
               ['Production, year to date (boepd)', '9,650', '9,688', '+38'], ['Availability, year to date', '93.8 %', '94.1 %', '+0.3 pts']],
              [5, 2, 2, 2], align=['l', 'r', 'r', 'r'], mono=(1, 2, 3)),
        sec('B', 'Operating cost (CHF million)'),
        table(['Cost group', 'Plan', 'Actual', 'Variance'],
              [['Personnel and contractors', '4.20', '4.25', '+0.05'], ['Logistics (supply vessel, helicopter)', '2.45', '2.52', '+0.07'],
               ['Maintenance and spares', '2.30', '2.36', '+0.06'], ['Insurance, fees and other', '1.35', '1.37', '+0.02']],
              [5, 2, 2, 2], align=['l', 'r', 'r', 'r'], mono=(1, 2, 3), total=('TOTAL', ['10.30', '10.50', '+0.20'])),
        sec('C', 'Comments'),
        *bullets(['Production was above plan for the month. No unplanned shutdowns.',
                  'Logistics ran over plan because of two extra helicopter transfers for spare parts.',
                  'Maintenance spend includes spare parts for the annual crane inspection planned for October.']),
    ]


D(A, 'monthly-production-cost-report-2028-09', 'Monthly Production and Cost Report, September 2028', 'NS-CFO-FIN-2028-09', '2028-10-02', 'Confidential, management',
  'CONFIDENTIAL · LEVEL N4', 'September production and operating cost against plan, with comments.', PF, 'FORM NS-FN-06 · REV. 08/23', 'Monthly Report', FIN, monthly,
  rows=[[(2, 'TITLE', 'Monthly Production and Cost Report, September 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-FIN-2028-09', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'MONTH', 'SEPTEMBER 2028'), (1, 'DATE', '02 OCT 2028'), (1, 'PREPARED BY', 'C. Reid')]],
  appr=[('PREPARED BY', 'C. Reid', '02 OCT 08:35 · e-sig'), ('RECEIVED', 'Group Finance', '02 OCT 09:10'), ('FILE COPY', '', '')], unit_short='FINANCE')


# ---- Overtime forecast ---------------------------------------------------------------------------------------
def overtime():
    return [
        sec('A', 'Forecast'),
        p('Overtime is expected to rise in January and February, when the crew has been on board for most of the season and maintenance of the winter backlog peaks. Hours are shown per function.'),
        table(['Function', 'Jan 2029 (h)', 'Feb 2029 (h)'],
              [['Operations and control room', '340', '360'], ['Maintenance', '520', '560'], ['Marine and deck', '180', '190'],
               ['Catering and cabin services', '90', '90'], ['Medical and radio', '60', '60'], ['Management and HSE', '40', '40']],
              [6, 2.4, 2.4], align=['l', 'r', 'r'], mono=(1, 2), total=('TOTAL HOURS', ['1,230', '1,300'])),
        sec('B', 'Cost'),
        table(['', 'Jan 2029', 'Feb 2029', 'Winter total'],
              [['Average cost per hour (CHF, including social charges)', '82', '82', ''], ['Forecast overtime cost (CHF thousand)', '101', '107', '208']],
              [6, 2, 2, 2.4], align=['l', 'r', 'r', 'r'], mono=(1, 2, 3)),
        sec('C', 'Assumptions'),
        *bullets(['Winter manning is unchanged at 50 on board.', 'No crew changes during the winter except for medical or operational reasons.',
                  'Overtime for November and December stays within the normal range and is not forecast separately.']),
    ]


D(A, 'overtime-forecast-jan-feb-2029', 'Winter Cost Review: Overtime Forecast, January and February 2029', 'NS-CFO-HR-2028-12', '2028-10-11', 'Internal, management',
  'INTERNAL USE · LEVEL N3', 'Expected overtime hours and cost per function for January and February 2029.', STAFF, 'FORM NS-HR-08 · REV. 04/23', 'Forecast', CFO, overtime,
  rows=[[(2, 'TITLE', 'Winter Cost Review: Overtime Forecast, January and February 2029', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-HR-2028-12', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'PERIOD', 'JAN – FEB 2029'), (1, 'DATE', '11 OCT 2028'), (1, 'REFERENCE', 'NS-CFO-HR-2028-10', {'mono': True})]],
  appr=[('PREPARED BY', 'Clinical Field Operations', '11 OCT 11:34 · e-sig'), ('REVIEWED', 'Group Finance', '11 OCT 16:05'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Procurement and contracts review -------------------------------------------------------------------------
def procurement():
    return [
        sec('1', 'Scope'),
        p('Finance reviews the procurement and contracts of Kelvara Petrochemicals AS as part of the integration. The review is on 15 December 2028 and covers the categories below. '
          'Existing contracts stay in force. Suppliers are not contacted before the review has reported.'),
        sec('2', 'Contract categories'),
        table(['Category', 'Contracts', 'Annual value (CHF m)', 'Kelvara contact'],
              [['Marine and supply services', '3', '18.5', 'Logistics'], ['Helicopter services', '2', '11.2', 'Logistics'], ['Catering and cabin services', '2', '6.4', 'Offshore operations'],
               ['Maintenance and inspection', '9', '22.7', 'Operations'], ['Drilling and well consumables', '6', '9.8', 'Procurement'], ['IT and telecommunications', '4', '3.1', 'Procurement'],
               ['Insurance, fees and other', '5', '7.4', 'Finance']],
              [5, 1.8, 3, 3.4], align=['l', 'r', 'r', 'l'], mono=(1, 2), total=('TOTAL', ['31', '79.1', ''])),
        sec('3', 'Timetable'),
        table(['Date', 'Step', 'Owner'],
              [['01 Nov 2028', 'Kelvara procurement provides the contract register', 'Kelvara procurement'], ['08 Dec 2028', 'Draft findings to Clinical Field Operations', 'Group Finance'], ['15 Dec 2028', 'Review meeting', 'Group Finance']],
              [2, 7, 3.4], mono=(0,)),
        p('Cost target: the group target of 6 percent lower operating cost from 2029 is about CHF 7.5 million on the 2028 budget (procurement CHF 2.9 million, logistics CHF 2.6 million, overhead CHF 2.0 million).', SMALL),
    ]


D(A, 'procurement-contracts-review-scope', 'Procurement and Contracts Review: Scope and Timetable', 'NS-CFO-FIN-2028-12', '2028-10-13', 'Confidential, management',
  'CONFIDENTIAL · LEVEL N4', 'What the review on 15 December covers, the contract categories and the timetable.', PF, 'FORM NS-FN-07 · REV. 08/23', 'Review Plan', FIN, procurement,
  rows=[[(2, 'TITLE', 'Procurement and Contracts Review: Scope and Timetable', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-FIN-2028-12', {'mono': True})],
        [(1, 'PROJECT', 'Kelvara integration'), (1, 'REVIEW DATE', '15 DEC 2028'), (1, 'DATE', '13 OCT 2028'), (1, 'TO', 'Site management')]],
  appr=[('PREPARED BY', 'Group Finance', '13 OCT 09:25 · e-sig'), ('APPROVED', 'R. Steinmetz', '13 OCT 12:40 · e-sig'), ('FILE COPY', '', '')], unit_short='KELVARA INTEGRATION')


# ---- Safety-critical maintenance status ------------------------------------------------------------------------
def maint():
    return [
        sec('A', 'Status by discipline'),
        table(['Discipline', 'Planned', 'Completed', 'Deferred (approved)', 'Overdue'],
              [['Mechanical', '68', '67', '1', '0'], ['Electrical', '41', '40', '1', '0'], ['Instrument', '52', '52', '0', '0'],
               ['Lifting and structural', '23', '22', '1', '0'], ['Safety systems', '30', '30', '0', '0']],
              [5, 2, 2, 3, 2], align=['l', 'r', 'r', 'r', 'r'], mono=(1, 2, 3, 4), total=('TOTAL', ['214', '211', '3', '0'])),
        sec('B', 'Deferrals'),
        p('Three tasks were deferred with approval from the Production Superintendent and the installation manager. All three are rescheduled for the first two weeks of November, before the winter rotation starts.'),
        sec('C', 'Winter backlog'),
        p('The winter maintenance plan is unchanged. Cost measures do not apply to safety-critical maintenance (see NS-CFO-FIN-2028-10, section 3).'),
    ]


D(A, 'safety-critical-maintenance-status-q3-2028', 'Safety-Critical Maintenance: Status, Q3 2028', 'NS-CFO-MNT-2028-Q3', '2028-10-09', 'Internal, management',
  'INTERNAL USE · LEVEL N3', 'Planned, completed and deferred safety-critical maintenance in Q3 2028.', PF, 'FORM NS-RP-06 · REV. 09/23', 'Status Report', CFO, maint,
  rows=[[(2, 'TITLE', 'Safety-Critical Maintenance: Status, Q3 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-MNT-2028-Q3', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'PERIOD', 'Q3 2028'), (1, 'DATE', '09 OCT 2028'), (1, 'PREPARED BY', 'C. Reid')]],
  appr=[('PREPARED BY', 'C. Reid', '09 OCT 07:58 · e-sig'), ('RECEIVED', 'Clinical Field Operations', '09 OCT 08:30'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')
