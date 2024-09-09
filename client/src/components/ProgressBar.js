const ProgressBar = ({ progress }) => {
  const colors = [
    'rgb(255, 214, 161)',
    'rgb(255, 175, 163)',
    'rgb(108, 115, 148)',
    'rgb(141, 181, 145)'
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (progress === 100) {
    return (
      <div className="completed-container">
        <p className="completed-text">Completed</p> {/* Display the "Completed" text */}
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="outer-bar">
        <div
          className="inner-bar"
          style={{ width: `${progress}%`, backgroundColor: randomColor }}
        />
      </div>
      <p className="progress-percentage">{progress}%</p> {/* Display the percentage */}
    </div>
  );
};

export default ProgressBar;
