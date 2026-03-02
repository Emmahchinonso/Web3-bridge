function App() {
  return (
    <main>
      <section>
        <h1>Transfer crypto the easy way, it's fast and reliable</h1>
        <button>Connect wallet</button>
      </section>
      <div>
        <form>
          <label htmlFor="receiverAddress">
            <input
              type="text"
              id="receiverAddress"
              placeholder="e.g 0xefbe.."
            />
          </label>
          <label>
            <input type="text" placeholder="e.g 5" />
          </label>
          <button>Send</button>
        </form>
      </div>
    </main>
  );
}

export default App;
