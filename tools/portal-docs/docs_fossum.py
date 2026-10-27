from doclib import *

A = 'fossum'
OCA = 'Office of Clinical Affairs'
SD, CO, RP = 'Study documents', 'Correspondence', 'Reports'
NAME = 'Dr. N. Fossum'


# ---- Protocol synopsis -----------------------------------------------------------------------------
def syn():
    return [
        sec('A', 'Study title'),
        box('A Phase II, randomised, double-blind, placebo-controlled study of the safety, tolerability and efficacy of NS-760 in maintaining cognitive performance in adults working '
            'extended winter rotations on offshore installations at high latitude.'),
        sec('B', 'Summary'),
        kv([('Study ID', 'BOREAS-2'), ('Sponsor', 'NeuroStat Holding AG'), ('Phase', 'II'),
            ('Population', 'Adults 18 to 65 years working an extended winter rotation at a participating installation'),
            ('Design', 'Randomised 1:1, double-blind, placebo-controlled, parallel group'),
            ('Duration', 'Treatment for the length of the winter rotation (about 20 weeks), with follow-up two weeks after the end of treatment'),
            ('Primary endpoint', 'Change from baseline in composite cognitive performance (attention, working memory, executive function) at week 12'),
            ('Secondary endpoints', 'Sleep (actigraphy and diary), mood, safety and tolerability, pharmacokinetics (sparse sampling)'),
            ('Local investigator', 'Installation medic (Dr. N. Fossum)')]),
        sec('C', 'Key eligibility'),
        *bullets(['<b>Inclusion:</b> age 18 to 65; working a winter rotation at the study site; able to give written informed consent.',
                  '<b>Exclusion:</b> epilepsy or seizure history; severe liver or kidney disease; regular use of prescription stimulants or sedatives; known hypersensitivity to racetam medicines; expected departure before the end of the rotation.']),
        sec('D', 'Procedures'),
        p('Participants attend the medical room weekly for dispensing and a short check, and complete cognitive testing with NeuroStat Baseline at fixed intervals. '
          'Study medication and placebo are identical in appearance. Treatment allocation is not known to the participant, the investigator or the crew.'),
    ]


D(A, 'protocol-synopsis', 'BOREAS-2 Protocol Synopsis, v1.2', 'NS-CA-BS2-SYN-v1.2', '2028-08-30', 'Study confidential', 'STUDY CONFIDENTIAL',
  'One-page summary of the BOREAS-2 protocol: design, endpoints, eligibility, procedures.', SD, 'FORM NS-CL-05 · REV. 05/24', 'Protocol Synopsis', OCA, syn,
  rows=[[(2, 'STUDY', 'BOREAS-2 · NS-760 (adravacetam)', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-SYN-v1.2', {'mono': True})],
        [(1, 'VERSION', '1.2'), (1, 'DATE', '30 AUG 2028'), (1, 'SITE', 'Ødemark A'), (1, 'STATUS', 'Approved')]],
  appr=[('PREPARED BY', 'Office of Clinical Affairs', '30 AUG 10:05 · e-sig'), ('APPROVED', 'Dr. A. Fenn', '30 AUG 11:30 · e-sig'), ('SITE COPY', NAME, '')], unit_short='BOREAS-2')


# ---- Informed consent form ------------------------------------------------------------------------------
def icf():
    return [
        sec('1', 'Why am I being asked?'),
        p('You work a long winter rotation on an offshore installation. We are asking whether you would like to take part in a study of a medicine called NS-760 that may help people keep their attention and memory steady during long periods of isolation and disturbed sleep.'),
        sec('2', 'What does taking part involve?'),
        *bullets(['You take one capsule a day for the length of the rotation. It contains either NS-760 or a placebo. Neither you nor the medic will know which you get.',
                  'You see the medic once a week for a short check and to collect your capsules.',
                  'You complete short computer tests on a tablet at fixed times, and wear a wrist sensor to record sleep.']),
        sec('3', 'Is taking part voluntary?'),
        p('Yes. You can decide not to take part, or stop at any time, without giving a reason. Your decision has no effect on your job, your pay or your rotation. Your employer is not told whether you take part.'),
        sec('4', 'Risks and benefits'),
        p('NS-760 is an investigational medicine. Side effects seen so far include headache, nausea and difficulty sleeping. You may not benefit personally. The study may help other people in the future.'),
        sec('5', 'Your data'),
        p('Your study data are coded. Your name is held only by the medic. NeuroStat and the authorities may see coded data. See the privacy information for details.'),
        sec('6', 'Consent'),
        fields([[(3, 'I have read this form and had the chance to ask questions', '', {'check': [('Yes', False), ('No', False)]})],
                [(3, 'I agree to take part in BOREAS-2', '', {'check': [('Yes', False), ('No', False)]})],
                [(3, 'I agree that my coded data may be used as described', '', {'check': [('Yes', False), ('No', False)]})]], number=False),
        gap(4),
        fields([[(2, 'NAME', '', {'shade': True}), (2, 'SIGNATURE', '', {'shade': True}), (1, 'DATE', '', {'shade': True})]], number=False, min_h=24),
    ]


D(A, 'informed-consent-form', 'BOREAS-2 Informed Consent Form for Crew, v1.1', 'NS-CA-BS2-ICF-v1.1', '2028-08-30', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Consent form for crew members considering BOREAS-2: what taking part involves, risks, data.', SD, 'FORM NS-CL-06 · REV. 05/24', 'Informed Consent', OCA, icf,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-ICF-v1.1', {'mono': True})],
        [(1, 'VERSION', '1.1'), (1, 'DATE', '30 AUG 2028'), (1, 'INVESTIGATOR', 'Installation medic'), (1, 'COPIES', 'Participant, medic')]],
  appr=None, unit_short='BOREAS-2')


# ---- Dispensing log ---------------------------------------------------------------------------------------------
def dl():
    return [
        sec('A', 'Dispensing'),
        p('Study medication dispensing log. Site: Ødemark A. One participant enrolled as at 19 October 2028.'),
        table(['Date', 'Participant', 'Kit no.', 'Quantity', 'Returned', 'Dispensed by'],
              [['21 Sep 2028', 'C.V.', 'K-0147', '7', '0', 'NF'], ['28 Sep 2028', 'C.V.', 'K-0148', '7', '0', 'NF'],
               ['05 Oct 2028', 'C.V.', 'K-0149', '7', '1', 'NF'], ['12 Oct 2028', 'C.V.', 'K-0150', '7', '0', 'NF']],
              [2.4, 2, 2, 1.6, 1.6, 2.2], align=['l', 'l', 'l', 'r', 'r', 'l'], mono=(0, 2, 3, 4)),
        sec('B', 'Notes'),
        *bullets(['One capsule returned on 5 October (missed dose). Participant reminded of the dosing schedule.',
                  'Next dispensing: 19 October 2028, kit K-0151.',
                  'Unused kits in the medical room: 34. Storage temperature recorded daily within the permitted range.']),
        gap(2),
        p('Initials key: NF = N. Fossum.', SMALL),
    ]


D(A, 'dispensing-log', 'BOREAS-2 Dispensing Log, Ødemark A', 'NS-CA-BS2-DL-001', '2028-10-12', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Dispensing of study medication at Ødemark A, kit by kit.', SD, 'FORM NS-CL-09 · REV. 05/24', 'Dispensing Log', OCA, dl,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-DL-001', {'mono': True})],
        [(1, 'AS AT', '19 OCT 2028'), (1, 'ENROLLED', '1'), (1, 'KEPT BY', NAME), (1, 'STORAGE', 'Medical room')]],
  appr=[('KEPT BY', NAME, '12 OCT 17:40 · e-sig'), ('MONITOR', '', ''), ('FILE COPY', '', '')], unit_short='BOREAS-2')


# ---- Correspondence --------------------------------------------------------------------------------------------------
MAILS = [
    ('Dr. A. Fenn, Office of Clinical Affairs', 'Dr. N. Fossum', '18 SEP 2028', 'BOREAS-2: first enrolment',
     'Dear Nils, thank you for completing site activation. As we discussed, we hope to enrol as many eligible crew members as possible during the first weeks of the rotation. '
     'Please send the enrolment log every Friday. Best regards, A. Fenn'),
    ('Dr. N. Fossum', 'Dr. A. Fenn, Office of Clinical Affairs', '22 SEP 2028', 'RE: BOREAS-2: first enrolment',
     'Dear Dr. Fenn, one participant is enrolled and has had the first dispensing. Several crew members have asked questions. Most are hesitant. I do not intend to press anyone. I will send the log on Fridays. Regards, Nils'),
    ('Dr. A. Fenn, Office of Clinical Affairs', 'Dr. N. Fossum', '29 SEP 2028', 'RE: RE: BOREAS-2: first enrolment',
     'Understood, and thank you. Please do keep the monthly Baseline assessments going for the whole crew, whether or not they take part in the study. The data are valuable for the programme. '
     'We will send a reminder to the installation manager. Regards, A. Fenn'),
    ('Dr. N. Fossum', 'Dr. A. Fenn, Office of Clinical Affairs', '10 OCT 2028', 'Baseline assessments, October',
     'The October assessments are scheduled for the week of 23 October. I will file the reports under the monthly assessments folder as before. One question: can the results be shared with the crew member on request? Regards, Nils'),
]


def cor():
    s = []
    for i, (frm, to, date, subj, text) in enumerate(MAILS, 1):
        s.append(KeepTogether([sec(str(i), 'Message of ' + date.title()), fields([[(2, 'FROM', frm), (2, 'TO', to), (1, 'DATE', date)], [(3, 'SUBJECT', subj)]], number=False), box(text)]))
    return s


D(A, 'correspondence-office-of-clinical-affairs', 'Correspondence with the Office of Clinical Affairs', 'NS-CA-BS2-COR-001', '2028-10-10', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Four messages between the Office of Clinical Affairs and the site, September and October 2028.', CO, 'FORM NS-CM-03 · REV. 04/22', 'Correspondence File', OCA, cor,
  rows=[[(2, 'FILE', 'BOREAS-2 · Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-COR-001', {'mono': True})],
        [(1, 'MESSAGES', '4'), (1, 'FROM', '18 SEP 2028'), (1, 'TO', '10 OCT 2028'), (1, 'KEPT BY', NAME)]],
  appr=None, unit_short='BOREAS-2')


# ---- Baseline adherence report ------------------------------------------------------------------------------------------
def adh():
    return [
        sec('A', 'Adherence'),
        p('Adherence to the monthly NeuroStat Baseline assessment, Ødemark A crew, September 2028.'),
        table(['Measure', 'Value'],
              [['Crew eligible for assessment', '50'], ['Sessions completed', '46'], ['Adherence', '92 %'],
               ['Sessions repeated because of technical problems', '3'], ['Crew who declined', '1']],
              [8, 3], align=['l', 'r'], mono=(1,)),
        sec('B', 'Observations'),
        *bullets(['Adherence is in line with August (94 %). Two missed sessions were due to shift conflicts.',
                  'Median completion time was 17 minutes. No tablet failures were reported.',
                  'Individual results are filed separately and are available only to the installation medic.']),
        gap(2),
        p('Next assessment: week of 23 October 2028.'),
    ]


D(A, 'baseline-adherence-report-2028-09', 'NeuroStat Baseline Adherence Report, September 2028', 'NS-CA-BL-ADH-2028-09', '2028-10-03', 'Internal', 'INTERNAL USE · LEVEL N2',
  'How many of the crew completed the September Baseline assessment.', RP, 'FORM NS-RP-07 · REV. 09/23', 'Adherence Report', OCA, adh,
  rows=[[(2, 'TITLE', 'NeuroStat Baseline Adherence Report, September 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BL-ADH-2028-09', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'MONTH', 'SEPTEMBER 2028'), (1, 'DATE', '03 OCT 2028'), (1, 'PREPARED BY', NAME)]],
  appr=[('PREPARED BY', NAME, '03 OCT 09:12 · e-sig'), ('RECEIVED', 'Office of Clinical Affairs', '03 OCT 10:05'), ('FILE COPY', '', '')], unit_short='NEUROSTAT BASELINE')


# ---- Site activation checklist ------------------------------------------------------------------------------------------
def act():
    items = [('Informed consent form v1.1 approved and in use', True), ('Protocol synopsis v1.2 received and read', True), ('Delegation and training log signed', True),
             ('Study medication delivered and counted (kits K-0147 to K-0184)', True), ('Storage thermometer calibrated and installed', True),
             ('Dispensing log and storage log started', True), ('Privacy information for crew handed to the installation manager for display', False)]
    rows = [[(5, t, '', {'check': [('Done', ok), ('Open', not ok)]})] for t, ok in items]
    return [
        sec('A', 'Checklist'),
        p('Complete every item before the first participant is enrolled. Return the signed checklist to the Office of Clinical Affairs.'),
        fields(rows, number=False),
        sec('B', 'Remarks'),
        box('All items were completed on 13 September 2028 except the display of the privacy information, which the installation manager has been asked to post in the mess. Recruitment may begin on 14 September 2028.'),
    ]


D(A, 'site-activation-checklist', 'BOREAS-2 Site Activation Checklist, Ødemark A', 'NS-CA-BS2-ACT-001', '2028-09-13', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Checklist completed before recruitment began on 14 September 2028.', SD, 'FORM NS-CL-04 · REV. 05/24', 'Site Activation', OCA, act,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-ACT-001', {'mono': True})],
        [(1, 'COMPLETED BY', NAME), (1, 'DATE', '13 SEP 2028'), (1, 'RECRUITMENT FROM', '14 SEP 2028')]],
  appr=[('COMPLETED BY', NAME, '13 SEP 16:22 · e-sig'), ('RECEIVED', 'Office of Clinical Affairs', '14 SEP 08:15'), ('FILE COPY', '', '')], unit_short='BOREAS-2')


# ---- Screening and enrolment log -----------------------------------------------------------------------------------------
def enr():
    return [
        sec('A', 'Weekly figures'),
        p('Figures are sent to the Office of Clinical Affairs every Friday. Participants are identified by initials only.'),
        table(['Week ending', 'Questions from crew', 'Screened', 'Declined', 'Enrolled', 'Enrolled, total'],
              [['15 Sep 2028', '3', '0', '0', '0', '0'], ['22 Sep 2028', '5', '2', '1', '1', '1'], ['29 Sep 2028', '2', '2', '2', '0', '1'],
               ['06 Oct 2028', '1', '1', '1', '0', '1'], ['13 Oct 2028', '2', '2', '2', '0', '1']],
              [2.4, 2.8, 1.8, 1.8, 1.8, 2.2], align=['l', 'r', 'r', 'r', 'r', 'r'], mono=(0, 1, 2, 3, 4, 5), total=('TOTAL', ['13', '7', '6', '1', '1'])),
        sec('B', 'Notes'),
        *bullets(['Screening takes place in the medical room after the crew member has read the consent form and has had time to think about it.',
                  'Reasons for declining are not recorded unless the crew member wishes to give one.',
                  'Participant C.V. was enrolled on 21 September 2028 (first dispensing, kit K-0147).']),
    ]


D(A, 'screening-enrolment-log', 'BOREAS-2 Screening and Enrolment Log, Ødemark A', 'NS-CA-BS2-EL-001', '2028-10-13', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Weekly screening and enrolment figures, 14 September to 13 October 2028.', SD, 'FORM NS-CL-07 · REV. 05/24', 'Enrolment Log', OCA, enr,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-EL-001', {'mono': True})],
        [(1, 'PERIOD', '14 SEP – 13 OCT 2028'), (1, 'KEPT BY', NAME), (1, 'ENROLLED', '1')]],
  appr=[('KEPT BY', NAME, '13 OCT 16:05 · e-sig'), ('SENT TO', 'Office of Clinical Affairs', '13 OCT 16:07'), ('FILE COPY', '', '')], unit_short='BOREAS-2')


# ---- Storage log -------------------------------------------------------------------------------------------------------------------
def sto():
    return [
        sec('A', 'Storage conditions'),
        p('Study medication is kept in the locked cabinet in the medical room at 15 to 25 °C. The temperature is read every morning and the thermometer records the minimum and maximum between readings. '
          'The thermometer was calibrated on 4 September 2028.'),
        sec('B', 'Weekly summary'),
        table(['Period', 'Lowest (°C)', 'Highest (°C)', 'Readings', 'Out of range', 'Checked by'],
              [['01 – 07 Oct 2028', '18.4', '21.9', '7', '0', 'NF'], ['08 – 14 Oct 2028', '18.1', '22.3', '7', '0', 'NF'], ['15 – 19 Oct 2028', '18.6', '21.7', '5', '0', 'NF']],
              [3, 2, 2, 1.6, 2, 1.8], align=['l', 'r', 'r', 'r', 'r', 'l'], mono=(0, 1, 2, 3, 4)),
        sec('C', 'Stock'),
        p('Unused kits in the cabinet on 19 October 2028: 34. No kits were damaged or lost. The count agrees with the dispensing log (NS-CA-BS2-DL-001).'),
    ]


D(A, 'study-medication-storage-log', 'BOREAS-2 Study Medication Storage and Temperature Log, October 2028', 'NS-CA-BS2-STO-001', '2028-10-19', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Daily storage temperature of the study medication, weekly summary for October.', SD, 'FORM NS-CL-10 · REV. 05/24', 'Storage Log', OCA, sto,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-STO-001', {'mono': True})],
        [(1, 'MONTH', 'OCTOBER 2028'), (1, 'PERMITTED RANGE', '15 – 25 °C'), (1, 'KEPT BY', NAME)]],
  appr=[('KEPT BY', NAME, '19 OCT 08:10 · e-sig'), ('MONITOR', '', ''), ('FILE COPY', '', '')], unit_short='BOREAS-2')


# ---- Privacy information ---------------------------------------------------------------------------------------------------------
def prv():
    return [
        sec('1', 'Who is responsible'),
        p('NeuroStat Holding AG, Thurgauerstrasse 66, 8050 Zürich, is responsible for the data collected in BOREAS-2. The data protection contact is privacy@neurostat.com.'),
        sec('2', 'What is collected'),
        *bullets(['Answers and measurements from the weekly checks, and the results of the computer tests on the tablet.', 'Sleep data from the wrist sensor.',
                  'Information about side effects. Your name and date of birth are held only by the installation medic and are not sent to NeuroStat.']),
        sec('3', 'Who can see it'),
        p('Your study data carry a code, not your name. NeuroStat, the authorities and the monitors of the study can see coded data. Your employer is not told whether you take part and does not receive your data.'),
        sec('4', 'How long it is kept'),
        p('Coded data are kept for as long as the law requires for clinical studies. The key linking the code to your name stays with the installation medic and is destroyed when the study has ended and the retention period for it has passed.'),
        sec('5', 'Your rights'),
        p('You can ask to see your data, ask for mistakes to be corrected, and withdraw from the study at any time. Data collected before you withdraw can still be used. Ask the medic, or write to privacy@neurostat.com.'),
    ]


D(A, 'privacy-information-for-crew', 'BOREAS-2 Privacy Information for Crew, v1.0', 'NS-CA-BS2-PRV-v1.0', '2028-08-30', 'Study confidential', 'STUDY CONFIDENTIAL',
  'What data BOREAS-2 collects, who sees it and for how long. Referred to in the consent form.', SD, 'FORM NS-CL-08 · REV. 05/24', 'Privacy Information', OCA, prv,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-PRV-v1.0', {'mono': True})],
        [(1, 'VERSION', '1.0'), (1, 'DATE', '30 AUG 2028'), (1, 'FOR', 'Crew members'), (1, 'COPIES', 'Participant, medic')]],
  appr=[('ISSUED BY', 'Office of Clinical Affairs', '30 AUG 10:20 · e-sig'), ('DATA PROTECTION', 'privacy@neurostat.com', ''), ('SITE COPY', NAME, '')], unit_short='BOREAS-2')


# ---- Delegation and training log -----------------------------------------------------------------------------------------------------
def dele():
    return [
        sec('A', 'Delegated duties'),
        table(['Name', 'Role', 'Duties', 'From'],
              [['Dr. N. Fossum', 'Local investigator (installation medic)', 'Consent, screening, dispensing, assessments, safety reporting, record keeping', '13 Sep 2028']],
              [2, 3, 6, 2], mono=(3,)),
        p('No other member of the crew is delegated study duties.', SMALL),
        sec('B', 'Training'),
        table(['Training', 'Date', 'Provided by'],
              [['Good clinical practice (online)', '22 Aug 2028', 'NeuroStat Clinical Services GmbH'], ['Protocol synopsis v1.2', '06 Sep 2028', 'Office of Clinical Affairs'],
               ['NeuroStat Baseline, administration', '12 Sep 2028', 'Office of Clinical Affairs'], ['Handling and storage of study medication', '13 Sep 2028', 'Office of Clinical Affairs']],
              [5, 2, 5], mono=(1,)),
        sec('C', 'Signature'),
        sign_lines(['LOCAL INVESTIGATOR', 'DATE']),
    ]


D(A, 'site-delegation-training-log', 'BOREAS-2 Site Delegation and Training Log', 'NS-CA-BS2-DEL-001', '2028-09-13', 'Study confidential', 'STUDY CONFIDENTIAL',
  'Who may carry out study duties at the site, and the training they have had.', SD, 'FORM NS-CL-03 · REV. 05/24', 'Delegation Log', OCA, dele,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-DEL-001', {'mono': True})],
        [(1, 'INVESTIGATOR', NAME), (1, 'DATE', '13 SEP 2028'), (1, 'VERSION', '1')]],
  appr=None, unit_short='BOREAS-2')


# ---- Adverse events -------------------------------------------------------------------------------------------------------------------------
def ae():
    return [
        sec('1', 'What to report'),
        *bullets(['Every adverse event is recorded in the participant file at the weekly check, whether or not it seems related to the study medication.',
                  'A serious adverse event is reported to the Office of Clinical Affairs within 24 hours: safety@neurostat.com and +41 44 538 17 33.',
                  'A serious event is one that is life-threatening, needs hospital treatment, causes lasting harm or is a congenital problem in a child of a participant.']),
        sec('2', 'Medical evacuation'),
        p('Decisions about evacuation are medical and are made by the installation medic under the installation procedure. The study office is informed afterwards.'),
        sec('3', 'Log'),
        table(['Date', 'Participant', 'Event', 'Serious', 'Related', 'Outcome'],
              [['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', '']], [2, 2, 5, 1.6, 1.8, 3], mono=(0,), zebra=True, row_h=17),
        gap(3),
        p('No adverse events recorded as at 19 October 2028.'),
    ]


D(A, 'adverse-event-reporting-guide-log', 'BOREAS-2 Adverse Event Reporting: Guide and Log', 'NS-CA-BS2-AE-001', '2028-09-13', 'Study confidential', 'STUDY CONFIDENTIAL',
  'When and how to report adverse events, with the site log.', SD, 'FORM NS-CL-11 · REV. 05/24', 'Safety Reporting', OCA, ae,
  rows=[[(2, 'STUDY', 'BOREAS-2 · Site: Ødemark A', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BS2-AE-001', {'mono': True})],
        [(1, 'KEPT BY', NAME), (1, 'AS AT', '19 OCT 2028'), (1, 'EVENTS RECORDED', '0')]],
  appr=None, unit_short='BOREAS-2')


# ---- Baseline guide ---------------------------------------------------------------------------------------------------------------------------
def gde():
    return [
        sec('1', 'Before the session'),
        *bullets(['Charge the tablet and check that the clock is correct. The session takes about 17 minutes.', 'Choose a quiet room. The crew member sits down and has water at hand.',
                  'Explain that the test is not an assessment of fitness for work.']),
        sec('2', 'During the session'),
        *numbered(['Sign the crew member in with the crew number. Do not enter the name.', 'Start the monthly assessment. The tablet guides the crew member through the tasks.',
                   'Stay in the room but do not help with the answers.', 'If a task fails because of a technical problem, repeat the session on the same day.']),
        sec('3', 'After the session'),
        *bullets(['The tablet stores the result encrypted. Individual results are available only to the installation medic.',
                  'File the monthly summary in the portal under Monthly assessments, and send the adherence figures to the Office of Clinical Affairs after the last session of the month.',
                  'A crew member who declines is recorded as declined. No reason is needed.']),
        sec('4', 'Support'),
        p('Technical problems: servicedesk@neurostat.com. Questions about the assessment: clinicalaffairs@neurostat.com.'),
    ]


D(A, 'baseline-guide-for-medics', 'NeuroStat Baseline: Guide for Medics, v2.3', 'NS-CA-BL-GDE-v2.3', '2028-06-12', 'Internal', 'INTERNAL USE · LEVEL N2',
  'How to run the monthly Baseline assessment with the crew.', RP, 'FORM NS-PR-07 · REV. 06/28', 'Procedure', OCA, gde,
  rows=[[(2, 'TITLE', 'NeuroStat Baseline: Guide for Medics, v2.3', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-BL-GDE-v2.3', {'mono': True})],
        [(1, 'VERSION', '2.3'), (1, 'DATE', '12 JUN 2028'), (1, 'FOR', 'Installation medics'), (1, 'SESSION', 'About 17 minutes')]],
  appr=[('ISSUED BY', 'Office of Clinical Affairs', '12 JUN 09:40 · e-sig'), ('REVIEWED', 'Medical Affairs', '12 JUN 13:05'), ('FILE COPY', '', '')], unit_short='NEUROSTAT BASELINE')


# ---- Medical room inventory -----------------------------------------------------------------------------------------------------------------------
def inv():
    return [
        sec('A', 'Inventory'),
        table(['Item', 'Quantity', 'Earliest expiry', 'Status'],
              [['Automated external defibrillator, pads', '2 sets', 'Mar 2030', 'Checked'], ['Oxygen cylinders (10 l)', '6', 'Jan 2031', 'Full'],
               ['IV fluids (sodium chloride 0.9 %, 500 ml)', '24', 'Aug 2029', 'Checked'], ['Analgesics (paracetamol, ibuprofen, opioids in locked cabinet)', 'See list', 'Feb 2029', 'Reorder ibuprofen'],
               ['Antibiotics (oral and IV)', 'See list', 'Nov 2029', 'Checked'], ['Sutures and wound closure', '40 packs', 'Jun 2031', 'Checked'],
               ['Splints and cervical collars', '12', 'No expiry', 'Checked'], ['Burn dressings', '30', 'Dec 2029', 'Checked']],
              [6, 1.8, 2.4, 2.8], mono=(1, 2)),
        sec('B', 'Actions'),
        *bullets(['Reorder ibuprofen before the winter rotation starts, with the supply run of 7 November.', 'Next check: 15 January 2029.']),
        gap(2),
        p('Study medication is kept separately in the locked cabinet and is not part of this inventory (see NS-CA-BS2-STO-001).', SMALL),
    ]


D(A, 'medical-room-inventory-q4-2028', 'Medical Room Inventory and Expiry Check, Q4 2028', 'NS-CA-MED-INV-2028-Q4', '2028-10-17', 'Internal', 'INTERNAL USE · LEVEL N2',
  'Stock and expiry dates in the medical room before the winter rotation.', RP, 'FORM NS-MED-05 · REV. 11/19', 'Inventory Check', OCA, inv,
  rows=[[(2, 'TITLE', 'Medical Room Inventory and Expiry Check, Q4 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CA-MED-INV-2028-Q4', {'mono': True})],
        [(1, 'INSTALLATION', 'Ødemark A'), (1, 'DATE', '17 OCT 2028'), (1, 'CHECKED BY', NAME), (1, 'NEXT CHECK', '15 JAN 2029')]],
  appr=[('CHECKED BY', NAME, '17 OCT 14:22 · e-sig'), ('RECEIVED', 'Office of Clinical Affairs', '17 OCT 15:00'), ('FILE COPY', '', '')], unit_short='MEDICAL SERVICES')
