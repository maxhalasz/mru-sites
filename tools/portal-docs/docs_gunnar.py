from doclib import *

A = 'gunnar'
CFO = 'Clinical Field Operations'
OCA = 'Office of Clinical Affairs'
MGR = 'Installation management'


# ---- Winter Operations Directive -------------------------------------------------------------
def wod():
    return [
        sec('1', 'Purpose'),
        p('This directive sets out the arrangements for the winter operating period from 1 November 2028 to the end of the spring crew change. '
          'It applies to installation managers in the Legacy Sites programme and to the Platform Supervisor of Ødemark A.'),
        sec('2', 'Crew and rotation'),
        *bullets(['Crews sign on for the full season. Regular crew changes are not planned and will be made only for medical or operational reasons.',
                  'Helicopter transfers are limited to medical and operational needs. Requests are made to the installation manager and logged.',
                  'Supply runs continue from the shore base when weather allows. Stocks of consumables must cover at least 21 days without resupply.']),
        sec('3', 'Health and welfare'),
        *bullets(['The installation medic reviews each crew member at the start of the season and at monthly intervals.',
                  'Daylight-lamp schedules apply from the first week of November. Families may contact the shore contact team at any hour.',
                  'Medical evacuation criteria are unchanged. The medic decides, and the installation manager confirms the transport.']),
        sec('4', 'Standby and escort'),
        p('Standby and escort arrangements for the winter period are covered by contract Cardume. Installation managers do not need to take action. Questions go to Clinical Field Operations.'),
        sec('5', 'Reporting'),
        p('Installation managers report weekly to Clinical Field Operations using the standard status sheet and immediately for any incident that may affect the study programme.'),
    ]


D(A, 'winter-operations-directive-2028-29', 'Winter Operations Directive 2028/29', 'NS-CFO-WOD-2028-29', '2028-09-28', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Arrangements for the winter operating period from 1 November 2028.', MGR, 'FORM NS-DR-03 · REV. 06/21', 'Directive', CFO, wod,
  rows=[[(2, 'TITLE', 'Winter Operations Directive 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-WOD-2028-29', {'mono': True})],
        [(1.4, 'TO', 'Installation managers, Legacy Sites programme; Platform Supervisor, Ødemark A'), (1, 'FROM', 'Clinical Field Operations'), (0.8, 'DATE', '28 SEP 2028')],
        [(1, 'EFFECTIVE', '1 NOV 2028'), (1, 'REPLACES', 'Winter directive 2027/28'), (1, 'CLASSIFICATION', 'Internal, installation managers')]],
  appr=[('ISSUED BY', 'M. Holt', '28 SEP 09:12 · e-sig'), ('ACKNOWLEDGED', '', ''), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- BOREAS-2 coordination notice -------------------------------------------------------------
def cn():
    return [
        sec('1', 'Background'),
        p('BOREAS-2 is a Phase II, randomised, double-blind, placebo-controlled study of NS-760 in adults working extended winter rotations at high latitude. '
          'Ødemark A has been enrolled as a study site. Recruitment began on 14 September 2028.'),
        sec('2', 'What this means for the platform'),
        *bullets(['The installation medic is the local study investigator. Study procedures are carried out in the medical room.',
                  'Participation is voluntary and is a matter between the crew member and the medic. The installation manager does not take part in enrolment and is not told who participates.',
                  'Study materials are delivered with the regular supply run and stored in the medical room under the conditions on the delivery note.',
                  'Crew members who participate keep working their normal schedule. There is no change to duties, rest periods or safety responsibilities.']),
        sec('3', 'Communication to the crew'),
        p('The Office of Clinical Affairs has sent an information note to the installation medic. Please do not discuss the study with the crew. Questions from crew members are referred to the medic.'),
        sec('4', 'Contacts'),
        p('Office of Clinical Affairs, NeuroStat Holding AG: clinicalaffairs@neurostat.com. For operational matters on the platform, contact Clinical Field Operations.'),
    ]


D(A, 'boreas-2-coordination-notice', 'BOREAS-2 Coordination Notice: Ødemark A', 'NS-CA-BS2-CN-001', '2028-09-12', 'Internal, installation managers',
  'STUDY CONFIDENTIAL', 'What the BOREAS-2 study means for the platform and its crew.', MGR, 'FORM NS-CM-01 · REV. 04/22', 'Memorandum', OCA, cn,
  rows=[[(2, 'SUBJECT', 'BOREAS-2 Coordination Notice: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-CN-001', {'mono': True})],
        [(1.4, 'TO', 'Platform Supervisor, Ødemark A'), (1, 'FROM', 'Office of Clinical Affairs'), (0.8, 'DATE', '12 SEP 2028')],
        [(1, 'STUDY', 'BOREAS-2 · NS-760'), (1, 'SITE', 'Ødemark A'), (1, 'DISTRIBUTION', 'Installation managers')]],
  appr=[('ISSUED BY', 'Dr. A. Fenn', '12 SEP 14:20 · e-sig'), ('COPY TO', 'Clinical Field Operations', ''), ('FILE COPY', '', '')], unit_short='BOREAS-2')


# ---- Recovery and placement summary -------------------------------------------------------------
def rps():
    return [
        sec('A', 'Installations'),
        p('This summary lists recoveries, retentions and placements recorded across installations in the Legacy Sites programme for Q3 2028. '
          'Installation managers should confirm their entries, or report no change, by 15 October 2028.'),
        table(['Installation', 'Recoveries Q3', 'Retained', 'Placements', 'Notes'],
              [['ØDM-A  Ødemark A', '0', '0', '0', 'No change. Winter standby confirmed (Cardume).'],
               ['FAL-01', '1', '1', '0', 'Placement pending.'],
               ['RMM-02', '0', '0', '0', 'No change.'],
               ['WIE-03', '2', '1', '1', 'One subject placed. Winter standby confirmed (Cardume).']],
              [3, 2, 1.6, 1.8, 6], align=['l', 'r', 'r', 'r', 'l'], mono=(1, 2, 3)),
        sec('B', 'Retained subjects now under contract'),
        table(['Ref.', 'Name', 'Origin', 'Recovered', 'Status', 'Current assignment'],
              [['R-0117', 'MEYER, Elias', 'BMH-01', '05 Sep 2023', 'Retained', 'Independent contractor (field), on call']],
              [1.2, 2, 1.2, 1.6, 1.3, 4], mono=(0, 2, 3)),
        p('Subjects not under contract are listed by reference only and are not reproduced in this summary.', SMALL),
        sec('C', 'Retained subjects not under contract (reference only)'),
        table(['Ref.', 'Status', 'Programme'], [['R-0098', 'Retained', 'Legacy Sites'], ['R-0112', 'Retained', 'Legacy Sites'], ['R-0121', 'Retained', 'Legacy Sites']],
              [1, 1.4, 2], mono=(0,)),
        p('Programme: Legacy Sites · Cost category: NOETIC-03. Distribution: installation managers. Do not forward.', SMALL),
    ]


D(A, 'recovery-placement-summary-q3-2028', 'Cross-Installation Recovery and Placement Summary, Q3 2028', 'NS-CFO-RPS-2028-Q3', '2028-10-02',
  'Confidential, installation managers', 'CONFIDENTIAL · LEVEL N4',
  'Recoveries, retentions and placements across installations, Q3 2028. Confirm entries or report no change by 15 October 2028.', 'Reports',
  'FORM NS-RP-05 · REV. 09/23', 'Quarterly Summary', CFO, rps,
  rows=[[(2, 'TITLE', 'Cross-Installation Recovery and Placement Summary, Q3 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-RPS-2028-Q3', {'mono': True})],
        [(1, 'PROGRAMME', 'Legacy Sites'), (1, 'COST CATEGORY', 'NOETIC-03', {'mono': True}), (1, 'DATE', '02 OCT 2028'), (1, 'RESPONSE DUE', '15 OCT 2028')]],
  appr=[('PREPARED BY', 'Clinical Field Operations', '02 OCT 11:05 · e-sig'), ('CONFIRMED BY INSTALLATION MANAGER', '', ''), ('FILE COPY', '', '')],
  unit_short='LEGACY SITES PROGRAMME')


# ---- Winter standby roster --------------------------------------------------------------------
def wsr():
    return [
        sec('A', 'Contractors on standby'),
        p('Contractors scheduled on standby for the winter period 2028/29, as at 16 October 2028.'),
        table(['Contract', 'Persons', 'Standby from', 'Readiness', 'Remarks'],
              [['Verdugo', '2', '01 Nov 2028', 'On call, 4 h', 'Field contractors. Not part of the installation crew.'],
               ['Cardume', '3', '01 Nov 2028', 'On station', 'Escort and standby with MS Nordvakt. Operated by Aegis Corporation.'],
               ['Cardume', '2', '15 Nov 2028', 'On call, 6 h', 'Relief for the above.']],
              [1.6, 1.3, 2, 2, 5], align=['l', 'r', 'l', 'l', 'l'], mono=(1, 2)),
        sec('B', 'Handling'),
        *bullets(['Standby contractors do not appear on the installation personnel-on-board list unless they are called out. Call-out is authorised by Clinical Field Operations.',
                  'Supervisors should not make arrangements for accommodation or transport for standby contractors. These are handled under the contracts.']),
    ]


D(A, 'winter-standby-contractor-roster', 'Winter Standby: Contractor Roster 2028/29', 'NS-CFO-WSR-2028-10', '2028-10-16', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Contractors scheduled on standby for the winter period, by contract.', MGR, 'FORM NS-RS-02 · REV. 03/22', 'Roster', CFO, wsr,
  rows=[[(2, 'TITLE', 'Winter Standby: Contractor Roster 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-WSR-2028-10', {'mono': True})],
        [(1, 'AS AT', '16 OCT 2028'), (1, 'PERIOD', 'WINTER 2028/29'), (1, 'INSTALLATION', 'Ødemark A'), (1, 'DISTRIBUTION', 'Installation managers')]],
  appr=[('ISSUED BY', 'Clinical Field Operations', '16 OCT 10:40 · e-sig'), ('RECEIVED', '', ''), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Weekly status sheet ------------------------------------------------------------------------
def wss():
    return [
        sec('A', 'Production and availability'),
        table(['Measure', 'Plan', 'Actual', 'Remark'],
              [['Production (boepd, weekly average)', '9,700', '9,742', ''],
               ['Availability', '94.0 %', '95.1 %', 'No unplanned shutdown'],
               ],
              [5, 2, 2, 4], align=['l', 'r', 'r', 'l'], mono=(1, 2)),
        sec('B', 'People on board'),
        table(['Measure', 'Value', 'Remark'],
              [['Average personnel on board (POB)', '50', 'Winter manning, unchanged'],
               ['Helicopter transfers', '1', 'Operational, spare part for crane 2'],
               ],
              [5, 1.6, 6], align=['l', 'r', 'l'], mono=(1,)),
        sec('C', 'Consumables and supply'),
        table(['Item', 'Days of stock', 'Minimum', 'Remark'],
              [['Food and cabin supplies', '26', '21', ''], ['Diesel', '29', '21', ''], ['Drilling and maintenance consumables', '24', '21', 'Order placed for the 17 Oct run']],
              [5, 2, 2, 5], align=['l', 'r', 'r', 'l'], mono=(1, 2)),
        sec('D', 'Maintenance and safety'),
        table(['Measure', 'Value', 'Remark'],
              [['Safety-critical maintenance, planned / completed', '31 / 31', 'None overdue'],
               ['Reportable incidents / near-miss reports', '0 / 2', 'Both near-misses closed'], ['Drills', '1', 'Muster drill, Tuesday']],
              [5, 1.6, 6], align=['l', 'r', 'l'], mono=(1,)),
        sec('E', 'Remarks'),
        box('Supply run of 10 October completed as planned. Crane 2 annual inspection completed on Thursday. Nothing to report for the study programme.'),
    ]


D(A, 'weekly-status-sheet-week-41', 'Weekly Installation Status Sheet, Week 41', 'NS-CFO-WSS-2028-41', '2028-10-16', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Weekly status for Ødemark A, 9 to 15 October 2028: production, people, supplies, maintenance.', 'Reports',
  'FORM NS-WS-01 · REV. 02/24', 'Weekly Status Sheet', CFO, wss,
  rows=[[(1.3, 'INSTALLATION', 'Ødemark A (ØDM-A)'), (1, 'WEEK', '41 · 9–15 OCT 2028'), (1, 'PREPARED BY', 'G. MacKenzie'), (1, 'DOCUMENT NO.', 'NS-CFO-WSS-2028-41', {'mono': True})]],
  appr=[('PREPARED BY', 'G. MacKenzie', '16 OCT 07:55 · e-sig'), ('RECEIVED', 'Clinical Field Operations', '16 OCT 08:20'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Supply run schedule -------------------------------------------------------------------------
def srs():
    return [
        sec('A', 'Scheduled runs'),
        p('Supply runs leave the shore base at Ågotnes on the dates below, weather allowing. The vessel is MS Nordvakt. Stocks on board must cover at least 21 days without resupply.'),
        table(['Run', 'Departs Ågotnes', 'Arrives Ødemark A', 'Cargo', 'Cut-off for orders'],
              [['N-1', 'Tue 07 Nov 2028', 'Tue 07 Nov, 16:00', 'Food, consumables, spares', 'Wed 01 Nov'],
               ['N-2', 'Tue 14 Nov 2028', 'Tue 14 Nov, 16:00', 'Food, consumables, spares', 'Wed 08 Nov'],
               ['N-3', 'Tue 21 Nov 2028', 'Tue 21 Nov, 16:00', 'Food, consumables, study materials', 'Wed 15 Nov'],
               ['N-4', 'Tue 28 Nov 2028', 'Tue 28 Nov, 16:00', 'Food, consumables, spares', 'Wed 22 Nov']],
              [1, 3, 3, 4, 3], mono=(0,)),
        sec('B', 'Ordering'),
        *bullets(['Orders go to the shore base through the installation manager by 12:00 on the cut-off day.',
                  'Urgent items outside a scheduled run are sent by helicopter only when the installation manager confirms an operational need.',
                  'Items for the medical room are packed separately and marked with the delivery note number.']),
        sec('C', 'Weather'),
        p('A run that cannot sail is moved to the next suitable day and the shore base informs the installation manager. Winter runs are planned with one spare day.'),
    ]


D(A, 'winter-supply-run-schedule-november-2028', 'Winter Supply Run Schedule, November 2028', 'NS-CFO-SRS-2028-11', '2028-10-17', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Supply runs from Ågotnes in November 2028 with order cut-off dates.', MGR, 'FORM NS-RS-04 · REV. 05/22', 'Schedule', CFO, srs,
  rows=[[(2, 'TITLE', 'Winter Supply Run Schedule, November 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-SRS-2028-11', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'SHORE BASE', 'Ågotnes'), (1, 'VALID', '1–30 NOV 2028'), (1, 'ISSUED', '17 OCT 2028')]],
  appr=[('ISSUED BY', 'Clinical Field Operations', '17 OCT 09:30 · e-sig'), ('SHORE BASE', 'Ågotnes', '17 OCT 11:02'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Daylight-lamp schedule ----------------------------------------------------------------------
def dls():
    return [
        sec('A', 'Schedule'),
        p('Daylight lamps in the mess, the gym and the recreation room follow the schedule below from the first week of November. The control room and the cabins are not affected.'),
        table(['Period', 'Morning', 'Midday', 'Afternoon', 'Lamp level'],
              [['1 Nov – 30 Nov', '06:30 – 09:30', '—', '14:30 – 16:30', 'Standard'],
               ['1 Dec – 31 Jan', '06:30 – 10:00', '12:00 – 13:00', '14:00 – 17:00', 'High'],
               ['1 Feb – 31 Mar', '06:30 – 09:30', '—', '14:30 – 16:30', 'Standard']],
              [3, 3, 3, 3, 2], mono=(1, 2, 3)),
        sec('B', 'Notes'),
        *bullets(['The medic can change the schedule for the installation after the monthly crew review.',
                  'Lamps are checked by the electrical team on the first Monday of each month.',
                  'Crew who work night shifts use the lamp in the recreation room after their shift, on the schedule agreed with the medic.']),
    ]


D(A, 'daylight-lamp-schedule-2028-29', 'Daylight-Lamp Schedule, Winter 2028/29', 'NS-CFO-DLS-2028-29', '2028-10-09', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Lamp times in the common areas from the first week of November.', MGR, 'FORM NS-RS-05 · REV. 05/22', 'Schedule', CFO, dls,
  rows=[[(2, 'TITLE', 'Daylight-Lamp Schedule, Winter 2028/29', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-DLS-2028-29', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'FROM', '1 NOV 2028'), (1, 'ISSUED', '9 OCT 2028')]],
  appr=[('ISSUED BY', 'Clinical Field Operations', '09 OCT 13:15 · e-sig'), ('MEDIC', '', ''), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Medical evacuation criteria -----------------------------------------------------------------
def mev():
    return [
        sec('1', 'Who decides'),
        p('The installation medic decides whether a crew member needs to be evacuated. The installation manager confirms the transport and informs Clinical Field Operations. This division of roles has not changed for the winter.'),
        sec('2', 'Criteria'),
        table(['Category', 'Examples', 'Transport'],
              [['Immediate', 'Cardiac event, severe bleeding, loss of consciousness, serious burns', 'Helicopter, as soon as it can fly'],
               ['Urgent', 'Fractures, acute abdominal pain, suspected stroke, eye injury', 'Helicopter, same day'],
               ['Planned', 'Conditions that need hospital treatment but are stable', 'Next crew change or scheduled run']],
              [2, 6, 4]),
        sec('3', 'What the installation manager does'),
        *numbered(['Confirm the transport with the helicopter operator and the shore base.',
                   'Record the time of the request and of the departure in the transfer log.',
                   'Inform Clinical Field Operations by phone and send the written report the same day.',
                   'Tell the family only through the shore contact team.']),
        sec('4', 'Contacts'),
        p('Shore contact team: +47 51 94 30 00, every hour. Clinical Field Operations: fieldops@neurostat.com.'),
    ]


D(A, 'medical-evacuation-criteria', 'Medical Evacuation Criteria and Transport Confirmation', 'NS-CFO-MEV-2028-02', '2028-03-14', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Who decides on a medical evacuation, the criteria and what the installation manager does.', MGR, 'FORM NS-PR-06 · REV. 03/28', 'Procedure', CFO, mev,
  rows=[[(2, 'TITLE', 'Medical Evacuation Criteria and Transport Confirmation', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-MEV-2028-02', {'mono': True})],
        [(1, 'APPLIES TO', 'Legacy Sites installations'), (1, 'REVISION', '2'), (1, 'ISSUED', '14 MAR 2028'), (1, 'STATUS', 'Unchanged for winter')]],
  appr=[('ISSUED BY', 'M. Holt', '14 MAR 10:02 · e-sig'), ('MEDICAL ADVISER', '', ''), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Minutes of the quarterly call -----------------------------------------------------------------
def minutes():
    return [
        sec('A', 'Attendance'),
        p('Chair: M. Holt, Head of Clinical Field Operations. Installation managers for ØDM-A, FAL-01, RMM-02 and WIE-03. Secretary: Clinical Field Operations. Duration: 55 minutes.'),
        sec('B', 'Items'),
        table(['No.', 'Item', 'Outcome'],
              [['1', 'Winter Operations Directive 2028/29', 'Presented. Questions to be sent to Clinical Field Operations by 11 October.'],
               ['2', 'BOREAS-2 coordination', 'Installation managers do not take part in enrolment and do not discuss the study with the crew. Questions are referred to the installation medic.'],
               ['3', 'Q3 recovery and placement summary', 'Installation managers confirm their entries, or report no change, by 15 October.'],
               ['4', 'Winter standby', 'Roster to be issued in mid-October. No action for installation managers.'],
               ['5', 'Reporting', 'Weekly status sheets continue on Mondays. Format unchanged.'],
               ['6', 'Any other business', 'None.']],
              [1, 5, 11], mono=(0,)),
        sec('C', 'Actions'),
        table(['Ref.', 'Action', 'Owner', 'Due'],
              [['A-1', 'Issue the winter standby roster', 'Clinical Field Operations', '16 Oct 2028'],
               ['A-2', 'Confirm recovery and placement entries', 'Installation managers', '15 Oct 2028'],
               ['A-3', 'Send directive questions', 'Installation managers', '11 Oct 2028'],
               ['A-4', 'Issue November supply run schedule', 'Clinical Field Operations', '17 Oct 2028']],
              [1, 7, 4, 2.4], mono=(0, 3)),
        gap(3),
        p('Next call: January 2029, date to be confirmed.', SMALL),
    ]


D(A, 'installation-managers-call-minutes-q3-2028', "Installation Managers' Quarterly Call: Minutes, Q3 2028", 'NS-CFO-MIN-2028-Q3', '2028-10-04', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Minutes of the Q3 call with the installation managers: items, outcomes and actions.', 'Reports', 'FORM NS-MN-01 · REV. 01/23', 'Minutes', CFO, minutes,
  rows=[[(2, 'MEETING', "Installation Managers' Quarterly Call, Q3 2028", {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-MIN-2028-Q3', {'mono': True})],
        [(1, 'DATE', '03 OCT 2028'), (1, 'TIME', '10:00 – 10:55 CET'), (1, 'FORMAT', 'Video call'), (1, 'MINUTES ISSUED', '04 OCT 2028')]],
  appr=[('MINUTES BY', 'Clinical Field Operations', '04 OCT 15:40 · e-sig'), ('APPROVED', 'M. Holt', '04 OCT 16:12 · e-sig'), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Helicopter transfer log -----------------------------------------------------------------------
def htl():
    rows = [['', '', '', '', '', ''] for _ in range(12)]
    return [
        sec('A', 'Log'),
        p('Requests for helicopter transfers are made to the installation manager and entered here before the flight is confirmed. Transfers are limited to medical and operational needs.'),
        table(['Date', 'Requested by', 'Type', 'Reason', 'Persons', 'Confirmed by'], rows, [2, 3, 2, 5, 1.6, 3], mono=(0, 4), zebra=True, row_h=18),
        gap(4),
        p('Type: M = medical, O = operational. Keep the log on the installation. A copy is sent to Clinical Field Operations with the weekly status sheet.', SMALL),
    ]


D(A, 'helicopter-transfer-log', 'Helicopter Transfer Log, Ødemark A', 'NS-CFO-HTL-2028-11', '2028-09-28', 'Internal, installation managers',
  'CONTROLLED COPY', 'Blank log for helicopter transfers during the winter period.', MGR, 'FORM NS-LG-03 · REV. 07/22', 'Transfer Log', CFO, htl,
  rows=[[(1.3, 'INSTALLATION', 'Ødemark A'), (1, 'PERIOD', 'FROM 1 NOV 2028'), (1, 'KEPT BY', 'Installation manager'), (1, 'DOCUMENT NO.', 'NS-CFO-HTL-2028-11', {'mono': True})]],
  appr=None, unit_short='LEGACY SITES PROGRAMME')
