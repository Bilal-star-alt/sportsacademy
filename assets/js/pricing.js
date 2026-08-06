const PRICING_CONFIG = {
  HOURLY_RATE: 20,
  PLAN_DISCOUNTS: { starter: 0.05, growth: 0.10, elite: 0.15 },
  UPFRONT_CASHBACK: 0.02,
};

const pricingForm = document.querySelector('#pricing-calculator');

if (pricingForm) {
  const hoursInput = document.querySelector('#hours');
  const upfrontInput = document.querySelector('#pay-upfront');
  const planInputs = document.querySelectorAll('input[name="plan"]');
  const errorMessage = document.querySelector('#hours-error');
  const checkoutButton = document.querySelector('#checkout-button');
  const checkoutStatus = document.querySelector('#checkout-status');
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  function calculatePricing() {
    const hours = Number(hoursInput.value);
    const validHours = Number.isInteger(hours) && hours > 0;
    const plan = document.querySelector('input[name="plan"]:checked').value;
    const discount = PRICING_CONFIG.PLAN_DISCOUNTS[plan];
    const baseCost = validHours ? hours * PRICING_CONFIG.HOURLY_RATE : 0;
    const savings = baseCost * discount;
    const discountedPrice = baseCost - savings;
    const cashback = upfrontInput.checked ? discountedPrice * PRICING_CONFIG.UPFRONT_CASHBACK : 0;
    const finalAmount = discountedPrice - cashback;

    errorMessage.textContent = validHours ? '' : 'Please enter a positive whole number of coaching hours.';
    checkoutButton.disabled = !validHours;
    document.querySelector('#summary-hours').textContent = validHours ? hours : '—';
    document.querySelector('#summary-rate').textContent = money.format(PRICING_CONFIG.HOURLY_RATE);
    document.querySelector('#summary-base').textContent = money.format(baseCost);
    document.querySelector('#summary-discount').textContent = `${discount * 100}%`;
    document.querySelector('#summary-savings').textContent = `−${money.format(savings)}`;
    document.querySelector('#summary-discounted').textContent = money.format(discountedPrice);
    document.querySelector('#summary-cashback').textContent = `−${money.format(cashback)}`;
    document.querySelector('#summary-final').textContent = money.format(finalAmount);
    document.querySelector('#cashback-row').hidden = !upfrontInput.checked;
  }

  [hoursInput, upfrontInput, ...planInputs].forEach((input) => input.addEventListener('input', calculatePricing));
  checkoutButton.addEventListener('click', () => {
    checkoutStatus.textContent = 'Your plan is ready. Contact the academy to complete your registration.';
  });
  document.querySelector('#hourly-rate').textContent = money.format(PRICING_CONFIG.HOURLY_RATE);
  calculatePricing();
}
