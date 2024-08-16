const SampleEdit = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "centre",
        alignItems: "centre",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="flex items-top mt-0">
        <div>
          <div className=" w-full h-full ">
            <img src="http://placehold.it/800x300"></img>
            <div className="flex flex-row p-2">
              <button className="m-2">Play</button>
              <button className="m-2">Stop</button>
              <button className="m-2">Toggle</button>
              <div className="m-2">Speed</div>
              <div className="m-2">Pitch</div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SampleEdit;
