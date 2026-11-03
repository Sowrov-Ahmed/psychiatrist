/*
 * js/data/blogs.js — Blog article DETAIL records
 * Path: js/data/blogs.js · Owner: Part 5 · Purpose: long-form content merged at runtime with SITE.blogIndex (same id/slug)
 * Depends on: SITE (index records, services) · Exposes: window.BLOGS
 */
(function (window) {
  'use strict';
  window.BLOGS = [
    {
      id: 'blg-001', slug: 'stress-or-depression-warning-signs', tags: ['Depression', 'Stress', 'Warning signs'], views: 1840,
      summary: 'How ordinary stress differs from depression, the warning signs worth taking seriously, and when to see a psychiatrist in Dhaka.',
      keyTakeaways: ['Stress has a clear cause and eases when the cause eases; depression often does not.', 'Low mood or lost interest lasting two weeks or more deserves a professional conversation.', 'Depression is common, treatable and nothing to be ashamed of.'],
      content: [
        { type: 'p', text: 'Stress and depression can look alike from the outside. Both leave you tired, short-tempered and unable to concentrate. In a city like Dhaka, where long commutes, long working hours and family expectations press on most adults, it is easy to assume that feeling flat is simply part of life. Sometimes it is. Sometimes it is not.' },
        { type: 'h2', text: 'How stress usually behaves' },
        { type: 'p', text: 'Stress has a cause you can name: a deadline, a quarrel, a hard month at the office. It tends to ease when the cause eases. A quiet weekend, a good night of sleep or a settled problem usually brings relief, and between the bad days you can still enjoy a meal, a joke or time with your family.' },
        { type: 'h2', text: 'Signs that point beyond stress' },
        { type: 'ul', items: ['Low or empty mood on most days for two weeks or more', 'Losing interest in things you normally enjoy, including time with people you love', 'Sleeping far too little or far too much', 'Changes in appetite or weight that you did not plan', 'Feeling worthless, guilty or like a burden to your family', 'Slowed thinking, poor concentration and fatigue that rest does not fix'] },
        { type: 'callout', tone: 'tip', title: 'A simple question', text: 'Ask yourself whether the feeling lifts when your circumstances improve. If good news, rest and a holiday change very little, that is worth mentioning to a doctor.' },
        { type: 'h2', text: 'What to do next' },
        { type: 'p', text: 'Start by telling one person you trust. Then arrange a consultation. A psychiatrist will ask about your mood, sleep, energy and daily life, and explain what is going on in plain language. Treatment may include talking therapy, medicine or both, and many people notice real improvement within weeks. This article cannot diagnose you; only a proper assessment can.' },
        { type: 'h2', text: 'When to seek help urgently' },
        { type: 'p', text: 'If you have thoughts of ending your life, or you feel unable to keep yourself safe, do not wait for an appointment. Call **999** or go to the nearest hospital emergency department, and ask someone to stay with you.' }
      ],
      relatedSlugs: ['how-to-support-someone-with-anxiety', 'when-to-seek-emergency-psychiatric-help'], serviceSlugs: ['depression-anxiety', 'psychotherapy-cbt']
    },
    {
      id: 'blg-002', slug: 'how-to-support-someone-with-anxiety', tags: ['Anxiety', 'Family', 'Support'], views: 1320,
      summary: 'Practical, kind guidance for family and friends supporting a person who lives with anxiety or panic.',
      keyTakeaways: ['Listening without fixing is often the most useful thing you can offer.', 'Avoid phrases like "just relax"; they make the person feel unheard.', 'Encourage professional help gently, and look after your own wellbeing too.'],
      content: [
        { type: 'p', text: 'When someone you love is anxious, the instinct is to reassure them quickly. In many Bangladeshi families the advice arrives in seconds: do not worry, think positive, everything will be fine. It is meant kindly, but a person living with anxiety has usually told themselves the same thing a hundred times already.' },
        { type: 'h2', text: 'What helps in the moment' },
        { type: 'ul', items: ['Stay calm and speak slowly, because your steadiness is contagious', 'Ask "What would help right now?" instead of guessing', 'Breathe out slowly together; a longer breath out settles the body', 'Move somewhere quieter if a crowd or noise is making it worse', 'Stay nearby until the wave passes, usually within minutes'] },
        { type: 'h2', text: 'What does not help' },
        { type: 'p', text: 'Telling someone to relax, calling them dramatic, or comparing them with a cousin who copes better all deepen shame. Anxiety is not a weakness of character. It is a real condition in which the body’s alarm system fires too often, and it responds well to treatment.' },
        { type: 'callout', tone: 'tip', title: 'Try this phrase', text: 'Say: "I can see this is hard. I am here, and we can work out the next step together." It validates the feeling without feeding the fear.' },
        { type: 'h2', text: 'Encouraging professional help' },
        { type: 'p', text: 'Raise it in a private, unhurried moment, not in the middle of an argument. Offer to find a doctor, travel with them or sit in the waiting room. Evidence-based treatment, including cognitive behavioural therapy and, when needed, medicine, helps most people. Remember to look after yourself too; supporting someone is tiring, and your own rest matters.' },
        { type: 'h2', text: 'When to seek urgent help' },
        { type: 'p', text: 'If the person talks about ending their life, or cannot stay safe, stay with them and call **999** or take them to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['stress-or-depression-warning-signs', 'mental-health-stigma-in-bangladesh'], serviceSlugs: ['depression-anxiety', 'psychotherapy-cbt']
    },
    {
      id: 'blg-003', slug: 'antidepressants-myths-and-facts', tags: ['Antidepressants', 'Medication', 'Myths'], views: 2410,
      summary: 'An honest guide to how antidepressants work, how long they take, and the questions to ask your doctor before starting.',
      keyTakeaways: ['Antidepressants are not addictive and do not change who you are.', 'They usually take several weeks to work, and early side effects often settle.', 'Never stop suddenly; agree any change with your doctor.'],
      content: [
        { type: 'p', text: 'Few subjects cause as much worry in our consulting rooms as antidepressants. Families fear that the tablets are addictive, that they will dull the personality or that once started they can never be stopped. Most of these fears are myths, and they stop many people from getting treatment that could help.' },
        { type: 'h2', text: 'Common myths, plain answers' },
        { type: 'ul', items: ['Myth: antidepressants are addictive. Fact: they do not cause craving or dependence in the way some sleeping pills do.', 'Myth: they change your personality. Fact: they aim to lift symptoms so that you feel like yourself again.', 'Myth: you will need them for life. Fact: many people take them for several months to a year or more, then stop gradually with guidance.', 'Myth: they work overnight. Fact: benefit usually builds over several weeks.'] },
        { type: 'h2', text: 'How they work and what to expect' },
        { type: 'p', text: 'Most antidepressants belong to classes that adjust the chemical messengers involved in mood and anxiety. In the first days some people notice nausea, restlessness or sleep changes, which commonly settle. Tell your doctor about anything troubling rather than quietly stopping.' },
        { type: 'callout', tone: 'warning', title: 'Do not stop suddenly', text: 'Stopping abruptly can cause unpleasant symptoms and may bring the illness back. Always reduce gradually, with your doctor’s plan.' },
        { type: 'h2', text: 'Questions to ask your doctor' },
        { type: 'p', text: 'Ask what the medicine is for, how long before you notice a difference, which side effects matter, how long treatment is likely to last and how to stop safely. Ask whether talking therapy should run alongside it. Good care is a conversation, not a prescription handed over in silence.' },
        { type: 'h2', text: 'When to seek urgent help' },
        { type: 'p', text: 'If your mood worsens sharply after starting treatment, or you have thoughts of harming yourself, contact your doctor straight away. In an emergency call **999** or go to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['stress-or-depression-warning-signs', 'insomnia-why-you-cant-sleep'], serviceSlugs: ['depression-anxiety']
    },
    {
      id: 'blg-004', slug: 'insomnia-why-you-cant-sleep', tags: ['Insomnia', 'Sleep habits', 'CBT'], views: 1675,
      summary: 'Why insomnia persists, the habits that feed it, and the proven steps, including CBT for insomnia, that help you sleep again.',
      keyTakeaways: ['Insomnia is kept going by worry and habits, not only by the original cause.', 'A fixed wake-up time and a calmer evening matter more than any gadget.', 'Sleeping pills are for short-term use only; structured therapy treats the problem itself.'],
      content: [
        { type: 'p', text: 'Lying awake at three in the morning, watching the ceiling fan turn, is exhausting. Many of our patients are professionals who answer messages until midnight, students up late before exams, or parents who sleep lightly with one ear open. Over weeks the bedroom itself becomes a place of worry.' },
        { type: 'h2', text: 'What keeps insomnia going' },
        { type: 'p', text: 'A bad night is normal. Insomnia becomes a pattern when we respond by napping, staying in bed longer, drinking more tea or coffee, or scrolling on the phone. These habits feel helpful, yet they weaken the body’s natural sleep drive and teach the brain that bed means being awake.' },
        { type: 'h2', text: 'Steps that genuinely help' },
        { type: 'ol', items: ['Wake at the same time every day, including Fridays and during Ramadan routines as far as you can', 'Keep caffeine to the morning and finish heavy meals earlier', 'Dim lights and put screens away for the last hour before bed', 'If you are awake for what feels like twenty minutes, get up, sit somewhere quiet and return when sleepy', 'Keep the bedroom cool, dark and only for sleep'] },
        { type: 'callout', tone: 'tip', title: 'Short naps only', text: 'If you must nap, keep it under twenty minutes and before mid-afternoon, so that night-time sleep stays strong.' },
        { type: 'h2', text: 'About sleeping pills' },
        { type: 'p', text: 'Sleeping tablets and benzodiazepines can cause tolerance and dependence, so they suit only short courses under supervision. Cognitive behavioural therapy for insomnia is the recommended first treatment and its benefits last.' },
        { type: 'h2', text: 'When to seek help' },
        { type: 'p', text: 'See a doctor if poor sleep continues for more than a month, if it affects work or driving, or if low mood, panic or heavy snoring come with it. If you ever feel unsafe, call **999** or go to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['stress-or-depression-warning-signs', 'antidepressants-myths-and-facts'], serviceSlugs: ['sleep-insomnia', 'psychotherapy-cbt']
    },
    {
      id: 'blg-005', slug: 'exam-pressure-teen-mental-health', tags: ['Teenagers', 'Exams', 'Parenting'], views: 1590,
      summary: 'A guide for parents on SSC and HSC pressure: early signs of burnout, what to say, and when to involve a child psychiatrist.',
      keyTakeaways: ['Changes in sleep, mood and appetite are often the first signs of burnout.', 'Calm conversation works better than comparison with classmates or cousins.', 'A teenager who withdraws completely or talks of hopelessness needs prompt professional care.'],
      content: [
        { type: 'p', text: 'In Bangladesh the SSC and HSC years carry enormous weight. Coaching classes fill the afternoons, relatives ask about results at every gathering, and a single score seems to decide a whole future. Many teenagers carry that pressure silently until it shows up as sleeplessness, headaches or anger at home.' },
        { type: 'h2', text: 'Early signs of burnout' },
        { type: 'ul', items: ['Sleeping badly or sleeping through the day', 'Stomach aches or headaches with no medical cause', 'Dropping friends, hobbies or prayers they once enjoyed', 'Irritability, tears or sudden outbursts', 'Saying they are "useless" or that nothing matters'] },
        { type: 'h2', text: 'What parents can do' },
        { type: 'p', text: 'Ask open questions at a calm moment, such as a walk or a meal, not at the study table. Listen first. Protect sleep and meals, even in exam week, and keep one hour a day for rest. Avoid comparing your child with others. Say clearly that your love does not depend on a grade. Agree a realistic study timetable together, and let your teenager see friends and sleep properly even in the busiest weeks.' },
        { type: 'callout', tone: 'tip', title: 'Say this', text: 'Try: "I care about you more than any result. Tell me what feels heaviest right now." Then listen without solving.' },
        { type: 'h2', text: 'When to see a specialist' },
        { type: 'p', text: 'Seek a child and adolescent psychiatrist if low mood, anxiety or school refusal lasts beyond two weeks, or if daily life is affected. Early help is simple and effective, and it does not go on a school record. A first visit is mostly a calm conversation with the parents and the young person, often seen separately for part of the time.' },
        { type: 'h2', text: 'When it cannot wait' },
        { type: 'p', text: 'If your teenager talks about not wanting to live, stay with them, remove anything that could hurt them from the room and call **999** or go to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['mental-health-stigma-in-bangladesh', 'how-to-support-someone-with-anxiety'], serviceSlugs: ['child-adolescent', 'psychotherapy-cbt']
    },
    {
      id: 'blg-006', slug: 'ocd-is-not-about-being-neat', tags: ['OCD', 'Obsessions', 'Treatment'], views: 1210,
      summary: 'What obsessive-compulsive disorder really looks like, how the cycle of obsessions and compulsions works, and how therapy breaks it.',
      keyTakeaways: ['OCD is a cycle of unwanted thoughts and repeated rituals, not a love of tidiness.', 'Reassurance and rituals bring brief relief but strengthen the cycle.', 'Exposure-based therapy, with medicine when needed, helps most people.'],
      content: [
        { type: 'p', text: 'People often say "I am so OCD" when they mean they like a tidy desk. Real obsessive-compulsive disorder is very different. It is a distressing condition that can take hours of a person’s day and quietly narrows their life.' },
        { type: 'h2', text: 'The cycle explained' },
        { type: 'p', text: 'An obsession is an unwanted thought, image or doubt that keeps returning: Did I lock the door? Are my hands truly clean? Have I offended God by a mistake in prayer? It brings intense anxiety. A compulsion is the action or mental ritual used to feel safe again, such as checking, washing, counting or asking the family for reassurance. Relief arrives, then the doubt returns stronger.' },
        { type: 'h2', text: 'What it can look like' },
        { type: 'ul', items: ['Washing or cleaning until the skin is sore', 'Checking switches, gas and locks again and again', 'Needing things in a particular order or number', 'Fear of causing harm by accident', 'Repeating prayers or ablutions because they felt "not right"'] },
        { type: 'callout', tone: 'warning', title: 'Reassurance feeds OCD', text: 'Family members who answer the same question twenty times mean well, but each answer strengthens the cycle. Ask the doctor how to respond kindly and differently.' },
        { type: 'h2', text: 'How treatment helps' },
        { type: 'p', text: 'The most effective approach is cognitive behavioural therapy with graded exposure and response prevention, done at a pace the person agrees to. Some people also benefit from medicine. Many learn to live with far less fear and take their mornings back.' },
        { type: 'h2', text: 'When to seek help' },
        { type: 'p', text: 'See a psychiatrist if rituals take more than an hour a day, harm your work or relationships, or leave you ashamed. If distress ever feels unbearable, call **999** or go to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['how-to-support-someone-with-anxiety', 'mental-health-stigma-in-bangladesh'], serviceSlugs: ['ocd-trauma', 'psychotherapy-cbt']
    },
    {
      id: 'blg-007', slug: 'mental-health-stigma-in-bangladesh', tags: ['Stigma', 'Family', 'Seeking help'], views: 2085,
      summary: 'Why "what will people say?" keeps families from seeking mental health care in Bangladesh, and how to start the conversation without shame.',
      keyTakeaways: ['Mental illness is a health condition, not a failure of faith, character or upbringing.', 'Starting with one trusted relative makes the first step easier.', 'Confidential care is available, and seeking it is a sign of strength.'],
      content: [
        { type: 'p', text: '"Log ki bolbe?" What will people say? Those words stop more families from seeking help than any lack of clinics or cost. A son withdraws, a daughter stops eating properly, a father no longer laughs, and the household explains it away as tiredness, weak faith or a phase.' },
        { type: 'h2', text: 'Where the silence comes from' },
        { type: 'p', text: 'Stigma grows from fear of gossip, worries about marriage prospects and job prospects, and old ideas that illness of the mind signals a flaw. Nobody would hide diabetes or a broken leg, yet a low mood is hidden for years. Some families turn first to prayer or a trusted elder. Faith and family are real strengths, and they work best alongside medical care, not instead of it.' },
        { type: 'h2', text: 'Starting the conversation' },
        { type: 'ul', items: ['Speak privately, in your own words, about what you have noticed', 'Describe feelings and behaviour, not labels or blame', 'Choose one trusted relative to tell first', 'Offer to attend the first appointment together', 'Remind each other that most people recover or improve with treatment'] },
        { type: 'callout', tone: 'tip', title: 'Privacy is protected', text: 'What you tell your doctor stays between you and the clinic, apart from rare situations involving a serious risk to safety. You choose who else is told.' },
        { type: 'h2', text: 'Finding care without shame' },
        { type: 'p', text: 'Online consultations let people speak from home, and evening chambers fit around work and school. Ask questions at the first visit; a good doctor welcomes them, and nobody will pressure you to decide anything on the day. Using language such as "a person living with depression" reminds us that the person comes first.' },
        { type: 'h2', text: 'When to seek urgent help' },
        { type: 'p', text: 'If someone you love speaks of not wanting to live, take it seriously. Stay with them and call **999** or go to the nearest hospital emergency department.' }
      ],
      relatedSlugs: ['when-to-seek-emergency-psychiatric-help', 'how-to-support-someone-with-anxiety'], serviceSlugs: ['depression-anxiety', 'psychotherapy-cbt']
    },
    {
      id: 'blg-008', slug: 'when-to-seek-emergency-psychiatric-help', tags: ['Emergency', 'Crisis', 'Safety'], views: 2760,
      summary: 'The warning signs that cannot wait for an appointment, and exactly what to do in Bangladesh, including calling 999.',
      keyTakeaways: ['Call 999 or go to the nearest hospital emergency department if life is at risk.', 'Stay with the person and stay calm until help arrives.', 'Chamber appointments are not for emergencies.'],
      content: [
        { type: 'p', text: 'Most mental health care can wait for a booked appointment. Some situations cannot. Knowing the warning signs, and the exact steps to take, can protect a life. Please read this page before you need it, and share it with your family.' },
        { type: 'h2', text: 'Warning signs that need urgent care' },
        { type: 'ul', items: ['Talking about wanting to die or not wanting to live', 'Saying goodbye, giving belongings away or putting affairs in order', 'Feeling unable to stay safe', 'Confusion, hearing or seeing things others do not, or seeming suddenly very unlike themselves', 'Severe agitation or behaviour that frightens the person or others', 'Seeming extremely hopeless, trapped or like a burden'] },
        { type: 'h2', text: 'What to do right now' },
        { type: 'ol', items: ['Call **999**, the national emergency number, or take the person to the nearest hospital emergency department', 'Stay with the person and do not leave them alone', 'Stay calm, listen and avoid arguing or blaming', 'Move anything that could be dangerous out of reach, quietly and without drama', 'Tell the emergency staff clearly what you have seen and what has happened'] },
        { type: 'callout', tone: 'warning', title: 'Not an emergency service', text: 'Chamber appointments and the appointment desk are not for emergencies. Existing patients may use the urgent line for advice, but if life is at risk always call 999 first.' },
        { type: 'h2', text: 'After the emergency' },
        { type: 'p', text: 'Once the person is safe, arrange a full assessment with a psychiatrist. Recovery is possible, and a crisis is often a turning point toward better care. If you are the one struggling, tell someone near you today. You deserve support, and people do come through the hardest nights.' },
        { type: 'p', text: 'Remember that talking openly about suicide does not plant the idea. Asking calmly and kindly, "Are you thinking of ending your life?", opens the door to help.' }
      ],
      relatedSlugs: ['stress-or-depression-warning-signs', 'mental-health-stigma-in-bangladesh'], serviceSlugs: ['depression-anxiety', 'bipolar-psychosis']
    }
  ];
})(window);
