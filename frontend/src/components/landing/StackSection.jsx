const stack = ['Node.js', 'Express', 'MySQL', 'JWT Auth', 'bcrypt', 'Cloudinary', 'Multer'];

function StackSection() {
  return (
    <section className="stack-section" id="stack">
      <div className="wrap">
        <div className="stack-head reveal">
          <h2>Built with</h2>
          <span>MVC · REST · MySQL</span>
        </div>
        <div className="badges reveal reveal-delay-1">
          {stack.map((item) => (
            <span key={item} className="badge">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StackSection;
