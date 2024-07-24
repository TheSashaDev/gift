const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const resultPopup = document.getElementById("result-popup");
const closeResultBtn = document.getElementById("close-result-btn");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "Open a postcard!" },
  { minDegree: 31, maxDegree: 90, value: "Try again..." },
  { minDegree: 91, maxDegree: 150, value: "Open a postcard!" },
  { minDegree: 151, maxDegree: 210, value: "Try again..." },
  { minDegree: 211, maxDegree: 270, value: "Try again..." },
  { minDegree: 271, maxDegree: 330, value: "Try again..." },
  { minDegree: 331, maxDegree: 360, value: "Open a postcard!" },
];

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
  "#8b35bc", 
  "#FFD700",
  "#8b35bc", 
  "#8b35bc", 
  "#8b35bc",
  "#FFD700", 
];

// Create chart
let myChart = new Chart(wheel, {
  // Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  // Chart Type Pie
  type: "pie",
  data: {
    // Labels (values which are to be displayed on chart)
    labels: ["Try \nagain...", "Open a \npostcard!", "Try \nagain...", "Try \nagain...", "Try \nagain...", "Open a \npostcard!"],
    // Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    // Responsive chart
    responsive: true,
    animation: { 
      duration: 1500,
      easing: 'easeOutCubic',
    },
    plugins: {
      // Hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      // Display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // If the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      spinBtn.disabled = false;
      finalValue.innerHTML = `<p>${i.value}</p>`; // Update the displayed value
      if (i.value === "Open a postcard!") {
        resultPopup.style.display = 'flex';
      }
      break;
    }
  }
};

// Spinner count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 101;

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  // Empty final value
  finalValue.innerHTML = `<p></p>`;
  // Generate random degrees to stop at
  // Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * 360);
  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    // Set rotation for piechart
    myChart.options.rotation = (myChart.options.rotation || 0) + resultValue;
    // Update chart with new value;
    myChart.update();
    // If rotation > 360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation === randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

// Popup initialization
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const continueBtn = document.getElementById('continue-btn');
  const countdownDisplay = document.createElement('div');
  countdownDisplay.className = 'countdown-timer';
  popup.querySelector('.popup-content').appendChild(countdownDisplay);

  let countdown = 3;

  const countdownInterval = setInterval(() => {
    countdownDisplay.textContent = countdown;
    countdown -= 1;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      continueBtn.disabled = false;
      countdownDisplay.textContent = '';
    }
  }, 1000);

  continueBtn.addEventListener('click', () => {
    popup.style.display = 'none'; // Hide the popup
    document.getElementById('spin-btn').disabled = false; // Enable the spin button
  });
  
  // Close result popup
  closeResultBtn.addEventListener('click', () => {
    resultPopup.style.display = 'none'; // Hide the result popup
  });
});
