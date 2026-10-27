from doclib import *

A = 'gunnar'
CFO = 'Clinical Field Operations'
MGR = 'Installation management'


# ---- Transcript of the quarterly call (the big information prop) ---------------------------------------
LINES = [
    ('10:00:12', 'SECRETARY', 'Recording has started. Present: M. Holt, F. Carvalho from Project Management, and the installation managers for ØDM-A, FAL-01, RMM-02 and WIE-03.'),
    ('10:00:31', 'HOLT, M.', 'Good morning. This is the Q3 call for the Legacy Sites installations. It is recorded for the programme file. Please do not forward the recording or the transcript. Local copies are deleted after thirty days. There are five items and I want to be done within the hour.'),
    ('10:01:05', 'HOLT, M.', 'First item, the winter directive that went out on 28 September. Crews sign on for the full season from 1 November. No crew changes unless they are medical or operational. Helicopter transfers only for medical and operational needs, logged, and approved by the installation manager. The winter plan was signed off on 26 September, and Dr. Fisher has read it and has no changes.'),
    ('10:01:48', 'NOVAK, P. (WIE-03)', 'Same as last winter for us. We changed nobody between November and April and I would like to keep it that way.'),
    ('10:01:58', 'HOLT, M.', 'That is the intention at every site.'),
    ('10:02:10', 'MWANGI, S. (RMM-02)', 'The directive says supply runs continue when weather allows. We lost nine days in January last year. Can the stock minimum go above twenty-one days?'),
    ('10:02:27', 'HOLT, M.', 'Twenty-one days stays the minimum. If you want more on site you can order it, and it is charged to your site budget.'),
    ('10:02:44', 'MACKENZIE, G. (ØDM-A)', 'Ødemark runs weekly from Ågotnes with the Nordvakt, so stock is not a problem for us. I have no questions on the directive.'),
    ('10:04:30', 'HOLT, M.', 'Second item, BOREAS-2. The Office of Clinical Affairs is running a Phase II study at Ødemark A through the winter. The installation medic is the investigator. Managers do not take part in enrolment and do not ask who participates. If the crew ask you about it, they go to the medic.'),
    ('10:05:10', 'BRANDT, E. (FAL-01)', 'Is the study coming to the other sites?'),
    ('10:05:19', 'CARVALHO, F. (PROJECT MGMT)', 'Not under this programme. Ødemark was chosen because the crew sign on for the whole season and the platform has been stable for years.'),
    ('10:05:34', 'BRANDT, E. (FAL-01)', 'Stable in what sense?'),
    ('10:05:41', 'CARVALHO, F. (PROJECT MGMT)', 'Same people, same rotation, same conditions. A study like this needs that.'),
    ('10:05:58', 'MACKENZIE, G. (ØDM-A)', 'The crew do the Baseline test on the tablet every month. The medic says the results go to Clinical Affairs.'),
    ('10:06:12', 'CARVALHO, F. (PROJECT MGMT)', 'Baseline results are collected centrally. Managers do not need to ask for them, and the medic does not need to file them on the installation. Keep the sessions going.'),
    ('10:08:00', 'HOLT, M.', 'Third item, the recovery and placement summary for Q3. You have it in front of you. Each of you confirms your entry, or reports no change, by 15 October.'),
    ('10:08:20', 'MACKENZIE, G. (ØDM-A)', 'ØDM-A is no change, same as every quarter. I sign these every quarter and I do not know what I am signing. What counts as a recovery?'),
    ('10:08:41', 'HOLT, M.', 'It counts what Project Management records as one. You are confirming that nothing has happened at your installation that should have been reported. That is all you are confirming.'),
    ('10:08:58', 'MACKENZIE, G. (ØDM-A)', 'And if something had happened?'),
    ('10:09:03', 'HOLT, M.', 'Then you call me. Not email.'),
    ('10:09:12', 'NOVAK, P. (WIE-03)', 'WIE-03 has two for the quarter. One retained, one placed. The placement went through last week.'),
    ('10:09:30', 'CARVALHO, F. (PROJECT MGMT)', 'Thank you. We do not discuss individual subjects on this call.'),
    ('10:09:42', 'BRANDT, E. (FAL-01)', 'FAL-01 has one placement pending. Do you need anything from the site?'),
    ('10:09:50', 'CARVALHO, F. (PROJECT MGMT)', 'No. Nothing changes at the site until Project Management confirms.'),
    ('10:10:08', 'MWANGI, S. (RMM-02)', 'RMM-02, no change.'),
    ('10:10:20', 'MACKENZIE, G. (ØDM-A)', 'One more for my own file. R-0117 has a name on my copy and the others are only numbers. Why him?'),
    ('10:10:34', 'HOLT, M.', 'Because he is under contract and the others are not. R-0117 is an independent contractor and his call-outs are authorised by my office.'),
    ('10:14:00', 'HOLT, M.', 'Fourth item, winter standby. The roster goes out on the sixteenth. Verdugo: two people, four hours readiness from 1 November, field contractors, not part of any crew. Cardume: three people on station with the Nordvakt, and a relief of two from 15 November. The other sites have their own arrangements.'),
    ('10:14:40', 'MACKENZIE, G. (ØDM-A)', 'Who are Verdugo? Are they ours or Kelvara\'s? The POB list on Ødemark is fixed at fifty.'),
    ('10:14:52', 'HOLT, M.', 'They are not on your POB list unless they are called out. The call-out is mine to authorise. You do not arrange accommodation or transport. The contracts cover it.'),
    ('10:15:12', 'MACKENZIE, G. (ØDM-A)', 'I would still like to know what I am hosting if they come out.'),
    ('10:15:20', 'CARVALHO, F. (PROJECT MGMT)', 'Two people with their own equipment. They will tell you what they need, and it will not be outside the contract.'),
    ('10:15:40', 'NOVAK, P. (WIE-03)', 'And Cinza?'),
    ('10:15:44', 'HOLT, M.', 'Cinza stays reserved at programme level. No presence is planned at any installation this winter. If that changes, Project Management will contact you directly.'),
    ('10:16:02', 'MACKENZIE, G. (ØDM-A)', 'I have seen Cinza on a cost line for Ødemark. Is that a supplier?'),
    ('10:16:10', 'HOLT, M.', 'It is a contract name.'),
    ('10:16:16', 'MACKENZIE, G. (ØDM-A)', 'Right. Verdugo, Cinza, Cardume. Somebody on my crew has a theory about the names. He thinks it is aliens and that we are all on a list. I told him that if it is aliens, they are over budget.'),
    ('10:16:38', 'BRANDT, E. (FAL-01)', '[laughter]'),
    ('10:16:42', 'HOLT, M.', 'Tell him it is a logistics contract.'),
    ('10:20:00', 'HOLT, M.', 'Fifth item, Ødemark A, because it is the oldest entry in the programme. It has been on the list since the 2010 survey and the profile has been stable since reactivation. What we want this winter is that nothing changes. Same crew, same routines, no work on the lower structure beyond the maintenance plan.'),
    ('10:20:30', 'MACKENZIE, G. (ØDM-A)', 'The cells and the shafts are inspected on the plan. We follow it and nothing has been added.'),
    ('10:20:42', 'CARVALHO, F. (PROJECT MGMT)', 'The seabed survey continues, and so do the ROV runs from the hangar, on the existing schedule. Any reading you cannot explain, or any footage that looks wrong, comes to my office the same day, unedited. Not through the Kelvara line.'),
    ('10:21:12', 'MACKENZIE, G. (ØDM-A)', 'Looks wrong how?'),
    ('10:21:16', 'CARVALHO, F. (PROJECT MGMT)', 'You would know. In three years of runs nobody has sent us any.'),
    ('10:21:40', 'MACKENZIE, G. (ØDM-A)', 'So I report to Kelvara management, to Marcus, and now to you.'),
    ('10:21:52', 'HOLT, M.', 'From 1 November Kelvara management reports to my office. For this item you write to Project Management and I am copied.'),
    ('10:22:10', 'MACKENZIE, G. (ØDM-A)', 'And who is Project Management?'),
    ('10:22:15', 'HOLT, M.', 'For you it is a mailbox and a phone number. The details are on the contact card I sent.'),
    ('10:50:00', 'HOLT, M.', 'Any other business?'),
    ('10:50:10', 'NOVAK, P. (WIE-03)', 'A question on the February close-out at WIE-03. Do we keep the access logs on site or send them in?'),
    ('10:50:20', 'CARVALHO, F. (PROJECT MGMT)', 'Send them in. Project Management keeps them, and the retention period is thirty years.'),
    ('10:51:00', 'HOLT, M.', 'Next call is in January. Please keep the recording to yourselves. Thank you.'),
    ('10:51:08', 'SECRETARY', 'Recording stopped.'),
]


def call():
    return [
        sec('A', 'Transcript'),
        p('Automatic transcript of the recording, checked against the audio by the secretary. Items 1 to 5 of the agenda are included. Parts of the call that were not on the agenda are left out, which shows as a jump in the time column.', SMALL),
        table(['Time', 'Speaker', 'Statement'], [[t, f'<b>{s}</b>', x] for t, s, x in LINES], [1.9, 3.7, 9.4], mono=(0,), small=True),
        gap(4),
        p('This transcript is distributed to the installation managers who took part. Do not forward it. Local copies are deleted thirty days after the call.', SMALL),
    ]


D(A, 'legacy-sites-call-transcript-q3-2028', 'Legacy Sites Call, Q3 2028: Transcript', 'NS-CFO-TR-2028-Q3', '2028-10-04', 'Confidential, installation managers',
  'CONFIDENTIAL · LEVEL N4', 'Transcript of the quarterly call with the Legacy Sites installation managers, 3 October 2028.', MGR,
  'FORM NS-CL-12 · REV. 02/25', 'Meeting Transcript', CFO, call,
  rows=[[(2, 'MEETING', 'Legacy Sites Programme: Installation Managers, Quarterly Call, Q3 2028', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-TR-2028-Q3', {'mono': True})],
        [(1, 'DATE', '03 OCT 2028'), (1, 'TIME', '10:00 – 10:55 CET', {'mono': True}), (1, 'SOURCE', 'Video call, recording'), (1, 'ENGINE', 'NS-ASR v2.3')],
        [(2, 'CHAIR', 'M. Holt, Clinical Field Operations'), (2, 'ALSO PRESENT', 'F. Carvalho (Project Management); installation managers ØDM-A, FAL-01, RMM-02, WIE-03')]],
  appr=[('TRANSCRIBED BY', 'NS-ASR v2.3', '03 OCT 11:10'), ('CHECKED BY', 'Clinical Field Operations', '04 OCT 09:25 · e-sig'), ('DISTRIBUTION', 'Installation managers', '')], unit_short='LEGACY SITES PROGRAMME')


# ---- Contact card: the direct line ---------------------------------------------------------------------
def card():
    return [
        sec('A', 'Contacts for installation managers'),
        table(['Desk', 'Use it for', 'Contact'],
              [['Clinical Field Operations, duty desk', 'Operations, incidents, call-outs and anything under the winter directive', 'fieldops@neurostat.com<br/>+41 44 538 17 50'],
               ['Project Management, Legacy Sites', 'Items that the quarterly call routes to Project Management. Not for routine reporting.', 'pm-legacy@neurostat.com<br/>+41 44 538 17 77'],
               ['Office of Clinical Affairs', 'Study questions that the medic cannot answer', 'clinicalaffairs@neurostat.com<br/>+41 44 538 17 33'],
               ['IT Service Desk', 'Portal access, passwords, devices', 'servicedesk@neurostat.com<br/>+41 44 538 17 40']],
              [3.6, 6, 4], small=True),
        sec('B', 'Rules'),
        *bullets(['Items marked "programme" go to Project Management directly and not through the Kelvara line.',
                  'The duty desks do not discuss other installations. If another installation calls you, refer them to their own manager.',
                  'Call-outs of standby contractors are authorised by Clinical Field Operations only.']),
    ]


D(A, 'installation-manager-contact-card', 'Contact Card for Installation Managers, Legacy Sites', 'NS-CFO-CC-2028-10', '2028-10-03', 'Internal, installation managers',
  'INTERNAL USE · LEVEL N3', 'Duty desks and the direct line to Project Management for the Legacy Sites installation managers.', MGR,
  'FORM NS-GR-04 · REV. 06/27', 'Contact Card', CFO, card,
  rows=[[(2, 'TITLE', 'Contact Card for Installation Managers, Legacy Sites', {'bold': True}), (1, 'DOCUMENT NO.', 'NS-CFO-CC-2028-10', {'mono': True})],
        [(1, 'ISSUED', '03 OCT 2028'), (1, 'VALID FROM', '1 NOV 2028'), (1, 'DISTRIBUTION', 'Installation managers')]],
  appr=[('ISSUED BY', 'M. Holt', '03 OCT 14:02 · e-sig'), ('RECEIVED', 'Installation managers', ''), ('FILE COPY', '', '')], unit_short='LEGACY SITES PROGRAMME')
