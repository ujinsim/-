import Form from "./components/Form";
import Chat from "./components/Chat";
import Viewer from "./components/Viewer";

export default function Home() {
  return (
    <div className="text-4xl p-10 font-bold">
      <h1>2025 달력 PDF 다운받아가세요 ! 🐍</h1>
      <div className="flex flex-row gap-5 p-10">
        <Viewer />
        <div>
          <Form />
          <Chat />
        </div>
      </div>
    </div>
  );
}
