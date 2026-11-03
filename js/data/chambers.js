/*
 * js/data/chambers.js — Chamber DETAIL records (extra fields only; merged with SITE.chambersIndex at runtime)
 * Path: js/data/chambers.js · Owner: Part 4 · Purpose: about text, facilities, directions, tips for each chamber
 * Depends on: nothing (loaded before js/pages/chambers.js) · Exposes: window.CHAMBERS
 */
(function () {
  'use strict';
  window.CHAMBERS = [
    {
      id: 'ch-001', slug: 'gulshan',
      bestFor: 'Evening visits close to Gulshan, Baridhara and nearby areas, with a private side entrance',
      about: [
        'The Gulshan chamber sits inside Serene Care Hospital, a short walk from the Gulshan-2 circle. It is the quieter of the two in-person chambers, with a private consultation room, a calm waiting lounge and a separate entrance for people who prefer not to cross the main lobby.',
        'Dr. Rashed sees patients here on Saturday, Monday and Wednesday evenings. Visits are booked in 30-minute slots so that nobody is rushed and nobody waits long. Please arrive ten minutes early for your first visit so the desk can open your file.'
      ],
      landmark: 'Opposite the Gulshan-2 circle, behind the bank branch on Road 90',
      facilities: [
        { icon: 'lock', title: 'Private consultation room', description: 'A closed room with a sound-insulated door. Nothing you say can be heard in the lounge.' },
        { icon: 'wheelchair', title: 'Step-free access', description: 'A ramp at the side entrance and a lift to the second floor, with staff on hand to help.' },
        { icon: 'users', title: 'Waiting lounge', description: 'Seating with a screen-free corner, water and a quiet area for families with children.' },
        { icon: 'heart', title: 'Pharmacy on site', description: 'A hospital pharmacy on the ground floor, open until the last consultation ends.' },
        { icon: 'car', title: 'Parking', description: 'Basement parking for about thirty cars and a drop-off bay at the main gate.' },
        { icon: 'shield', title: 'Discreet entrance', description: 'A side door to the chamber floor, so you can arrive and leave without passing the main reception.' }
      ],
      howToReach: {
        byRoad: 'From Gulshan-1, drive towards the Gulshan-2 circle and turn into Road 90 at the second left after the circle. The hospital gate is on your right, about two minutes from the main road. From Baridhara or Mohakhali it takes ten to fifteen minutes outside peak traffic.',
        byRideshare: 'Set Serene Care Hospital, Road 90 as your destination and ask to be dropped at the side gate, which is quicker than the main gate in the evening. Evening jams around the circle are common, so book your ride at least thirty minutes ahead.',
        byBus: 'Buses on the Mohakhali to Gulshan route stop near the Gulshan-2 circle. From there it is a walk of about eight minutes along Road 90, or a short rickshaw ride. Buses become crowded from 5:30 PM, so leave early.',
        parking: 'Basement parking is free for patients for up to two hours. Show your appointment message at the barrier. If the basement is full, the guard will direct you to street parking on Road 90.'
      },
      patientTips: [
        'Arrive ten minutes early for a first visit so your file is ready and you can settle in.',
        'Bring any earlier prescriptions, test reports and a list of the medicines you take now.',
        'Evening traffic around Gulshan-2 is heavy, so allow extra time after 5:00 PM.',
        'You may bring a family member or friend. Tell the desk if you would like to see the doctor alone.'
      ],
      mapQuery: 'House 62, Road 90, Gulshan-2, Dhaka 1212'
    },
    {
      id: 'ch-002', slug: 'bashundhara',
      bestFor: 'Families from Bashundhara, Badda and Uttara, including teenagers and children',
      about: [
        'The Bashundhara chamber is in Bashundhara NeuroCare Centre, in Block D close to the main road. It serves families from Bashundhara, Baridhara, Badda and Uttara who want an evening appointment without crossing the city.',
        'Dr. Rashed sees patients here on Sunday and Tuesday afternoons and evenings. The centre has a family waiting room, which many parents find helpful when they bring a teenager or a young child for a first assessment.'
      ],
      landmark: 'Block D, Road 3, a few minutes from the Bashundhara main gate',
      facilities: [
        { icon: 'lock', title: 'Private consultation room', description: 'A closed, quiet room where the doctor sees one patient or family at a time.' },
        { icon: 'wheelchair', title: 'Step-free access', description: 'Ground-floor entry, wide doors and a lift to the clinic floor.' },
        { icon: 'users', title: 'Family waiting room', description: 'A separate room for parents and teenagers, with seating and a child-friendly corner.' },
        { icon: 'heart', title: 'Pharmacy next door', description: 'A pharmacy beside the centre entrance that stays open through the evening session.' },
        { icon: 'car', title: 'Parking', description: 'A forecourt with space for cars and motorbikes, and a guard to help you park.' },
        { icon: 'clock', title: 'Short waits', description: 'Visits run to time. If the doctor is delayed, the desk tells you by phone or message.' }
      ],
      howToReach: {
        byRoad: 'Enter Bashundhara R/A through the main gate and follow the road to Block D. Turn into Road 3; the centre is on the left, marked by a blue signboard. From Gulshan it takes about twenty-five minutes outside peak hours.',
        byRideshare: 'Search for Bashundhara NeuroCare Centre, Block D. Drivers know the block well, but ask them to stop at the forecourt, not the street corner. Ride requests are usually answered within a few minutes in the afternoon.',
        byBus: 'Buses on the Notun Bazar to Bashundhara route stop near the main gate. From the gate, take a rickshaw into Block D, which costs little and takes about ten minutes. Allow extra time on Tuesdays, when the roads are busy.',
        parking: 'The forecourt holds about fifteen cars and a row of motorbikes. Parking is free for patients. On busy days, the guard will point you to the side lane on Road 3.'
      },
      patientTips: [
        'Bring a parent or guardian if the patient is under 18; the doctor will also speak with the young person alone if they wish.',
        'Bring school reports or earlier assessments if your child is being seen for attention or learning concerns.',
        'Write down the three things that worry you most. It helps to start the visit with them.',
        'If you need to cancel, call or message the desk the day before so another patient can have the slot.'
      ],
      mapQuery: 'Block D, Road 3, Bashundhara R/A, Dhaka 1229'
    },
    {
      id: 'ch-003', slug: 'online',
      bestFor: 'People outside Dhaka or abroad, busy schedules and follow-up reviews from home',
      about: [
        'The online consultation is a secure video appointment with Dr. Rashed, for people who live outside Dhaka, travel often, work long hours or find it easier to talk from home. It covers the same assessment, treatment planning and follow-up as an in-person visit.',
        'Sessions run on Thursday evenings and Friday mornings. After you book, the video link arrives on WhatsApp or email 30 minutes before your slot. You do not need to install anything beyond a normal browser or a free video app.'
      ],
      facilities: [
        { icon: 'video', title: 'Secure video room', description: 'A private link used only for your appointment. It stops working after the session.' },
        { icon: 'lock', title: 'No recording', description: 'Sessions are never recorded or stored. Only the doctor and you are in the call.' },
        { icon: 'globe', title: 'From anywhere', description: 'Join from Bangladesh or abroad, wherever you have a steady internet connection.' },
        { icon: 'file-text', title: 'Digital prescription', description: 'When medicine is advised, the prescription is sent as a PDF after the session.' },
        { icon: 'message-circle', title: 'WhatsApp follow-up', description: 'The desk sends reminders and shares reports through WhatsApp or email, as you prefer.' },
        { icon: 'wifi', title: 'Works on mobile data', description: 'A phone on a normal 4G connection is enough. No special equipment is needed.' }
      ],
      howItWorks: [
        { title: 'Book your slot', description: 'Choose Online Consultation on the booking page, then pick a Thursday evening or Friday morning time.' },
        { title: 'Receive your link', description: 'The video link arrives on WhatsApp or email 30 minutes before your appointment, with a short checklist.' },
        { title: 'Meet the doctor', description: 'Join from a quiet, private place. Dr. Rashed listens first, asks questions and explains his thinking in plain words.' },
        { title: 'Get your plan', description: 'You leave the call with a clear plan. A written summary and any prescription follow within the day.' }
      ],
      techNeeds: [
        'A phone, tablet or computer with a working camera and microphone',
        'A steady connection: mobile 4G or home Wi-Fi is fine',
        'Headphones, if you want extra privacy at home',
        'A quiet room where you will not be interrupted for 30 minutes'
      ],
      privacyNotes: [
        'The session is never recorded, by us or by the system.',
        'Your video link is single-use and is shared only with you.',
        'The doctor will ask for your location at the start, so help can be sent to you if there is a serious risk to your safety.'
      ],
      patientTips: [
        'Join five minutes early to test your sound and camera.',
        'Keep your medicines, reports and a pen close by.',
        'If the call drops, the doctor will call you on the number you gave when booking.',
        'Online visits are not suitable in an emergency. Call 999 or go to the nearest hospital emergency department.'
      ]
    }
  ];
})();
