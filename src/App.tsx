import { Field, Input } from "@headlessui/react";
import Header from "./components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <main className="mt-10 px-4">
        <div className="">
          <section className="text-center">
            <h1 className="mb-10 font-semibold text-2xl text-gray-600">
              Transfer crypto the easy way, it's fast and reliable
            </h1>
          </section>
          <div className="w-[500px] bg-white mx-auto shadow-[0px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] rounded-2xl p-10 ">
            <form>
              <div className="space-y-5 mb-12">
                <Field>
                  <label className="input-label mb-1">Receiver address</label>
                  <Input
                    type="text"
                    name="receiverAddress"
                    placeholder="e.g 0xefbe.."
                    className="input"
                  />
                </Field>
                <Field>
                  <label className="input-label mb-1">Token amount</label>
                  <input
                    type="text"
                    placeholder="e.g 5"
                    name="token amount"
                    className="input"
                  />
                </Field>
              </div>
              <button className="w-full py-4 bg-black text-white rounded-full">
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
