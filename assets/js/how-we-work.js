const workJourney = {
  1: { title: 'Start your athlete journey', intro: 'Join Sports Academy and create a profile that honours your unique starting point—not just your results.', learn: ['Name and age', 'Sport interests', 'Experience level', 'Athletic goals'], gain: 'A personalised profile and recommendations shaped around your journey.' },
  2: { title: 'Get matched with opportunities', intro: 'Our platform uses your profile to make the search for the right next step much clearer.', learn: ['Training programs and coaches', 'Sports academies and camps', 'Teams and competitions', 'Development opportunities'], gain: 'Recommendations matched to your sport, age, skill level, location, and goals.' },
  3: { title: 'Select your development plan', intro: 'Choose a flexible plan that reflects your commitment level, schedule, and athletic ambitions.', learn: ['Starter Journey: 0–60 days, 5% savings', 'Growth Journey: 61–120 days, 10% savings', 'Elite Journey: 121+ days, 15% savings', 'Optional 2% cashback for upfront payment'], gain: 'Transparent $20/hour pricing and a plan you can explore at your own pace.' },
  4: { title: 'Train, learn, and improve', intro: 'Consistent progress happens when the right support and a clear routine come together.', learn: ['Training schedules', 'Practice resources', 'Skill development plans', 'Coaching guidance and communication'], gain: 'A structured development routine that keeps your goals in sight.' },
  5: { title: 'Track your progress', intro: 'Growth is easier to believe in when you can see it, celebrate it, and learn from it.', learn: ['Completed training hours', 'Skills improved', 'Achievements and milestones', 'Coach feedback'], gain: 'A progress dashboard that makes every step forward visible and motivating.' },
  6: { title: 'Unlock new opportunities', intro: 'As your confidence, skills, and experience grow, new possibilities should grow with you.', learn: ['Advanced training', 'Competitive programs', 'Tournaments and showcases', 'Scholarship opportunities'], gain: 'A clearer pathway toward the bigger opportunities you are working for.' },
  7: { title: 'Continue your sports journey', intro: 'Sports development never stands still, and neither should your support system.', learn: ['New achievements', 'Updated goals', 'Performance history', 'Ongoing skill development'], gain: 'Recommendations that evolve with you through every new stage of your journey.' },
};

const detailPanel = document.querySelector('#work-detail');
document.querySelectorAll('[data-work-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const step = workJourney[button.dataset.workStep];
    document.querySelectorAll('[data-work-step]').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-selected', 'true');
    detailPanel.innerHTML = `<p class="eyebrow">Step ${String(button.dataset.workStep).padStart(2, '0')}</p><h3>${step.title}</h3><p>${step.intro}</p><div class="work-detail-grid"><div><strong>What this includes</strong><ul>${step.learn.map((item) => `<li>${item}</li>`).join('')}</ul></div><div><strong>What you gain</strong><p>${step.gain}</p></div></div>`;
  });
});
