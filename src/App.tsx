import { ReactNode, useState } from "react";

const assets = import.meta.glob("./assets/**/*.svg", { as: "url" });
const EyeSVGs: string[] = [];
const EyeBrowsSVGs: string[] = [];
const HeadSVGs: string[] = [];
const MouthSVGs: string[] = [];
const DetailsSVGs: string[] = [];
for (const url in assets) {
  const path = await assets[url]();
  if (path.includes("eyes/")) {
    EyeSVGs.push(path);
  } else if (path.includes("eyebrows/")) {
    EyeBrowsSVGs.push(path);
  } else if (path.includes("head/")) {
    HeadSVGs.push(path);
  } else if (path.includes("mouth/")) {
    MouthSVGs.push(path);
  } else if (path.includes("details/")) {
    DetailsSVGs.push(path);
  }
}

function Area({
  title,
  svg,
  selected,
  setSelected,
}: {
  title: string;
  svg: string[];
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="rounded-lg p-8 bg-white my-5">
      <h2 className="text-xl pb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {svg.map((path, idx) => (
          <div key={idx} onClick={() => setSelected(idx)}>
            <SelectButton selected={selected == idx}>
              <img src={path} className="w-12 h-12" />
            </SelectButton>
          </div>
        ))}
        <div onClick={() => setSelected(-1)}>
          <SelectButton selected={selected == -1}>
            <div className="w-12 h-12" />
          </SelectButton>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [eyes, setEyes] = useState<number>(0);
  const [head, setHead] = useState<number>(0);
  const [eyebrows, setEyebrows] = useState<number>(0);
  const [mouth, setMouth] = useState<number>(0);
  const [details, setDetails] = useState<number>(0);

  return (
    <div className="bg-gray-100 flex justify-center p-4 gap-4">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-center pt-8">
          Fluent Emoji Maker
        </h1>
        <Area
          title="Head"
          svg={HeadSVGs}
          selected={head}
          setSelected={setHead}
        />
        <Area
          title="Eyes"
          svg={EyeSVGs}
          selected={eyes}
          setSelected={setEyes}
        />
        <Area
          title="Eyebrows"
          svg={EyeBrowsSVGs}
          selected={eyebrows}
          setSelected={setEyebrows}
        />
        <Area
          title="Mouth"
          svg={MouthSVGs}
          selected={mouth}
          setSelected={setMouth}
        />
        <Area
          title="Details"
          svg={DetailsSVGs}
          selected={details}
          setSelected={setDetails}
        />
      </div>
      <div className="flex-shrink-0 sticky w-36 h-36 bg-white rounded-lg top-28">
        {head >= 0 && (
          <img
            src={HeadSVGs[head]}
            className="absolute w-20 h-20 top-0 right-0 left-0 bottom-0 m-auto"
          />
        )}
        {eyes >= 0 && (
          <img
            src={EyeSVGs[eyes]}
            className="absolute w-20 h-20 top-0 right-0 left-0 bottom-0 m-auto"
          />
        )}
        {eyebrows >= 0 && (
          <img
            src={EyeBrowsSVGs[eyebrows]}
            className="absolute w-20 h-20 top-0 right-0 left-0 bottom-0 m-auto"
          />
        )}
        {mouth >= 0 && (
          <img
            src={MouthSVGs[mouth]}
            className="absolute w-20 h-20 top-0 right-0 left-0 bottom-0 m-auto"
          />
        )}
        {details >= 0 && (
          <img
            src={DetailsSVGs[details]}
            className="absolute w-20 h-20 top-0 right-0 left-0 bottom-0 m-auto"
          />
        )}
      </div>
    </div>
  );
}

const SelectButton = ({
  selected = false,
  children,
}: {
  selected?: boolean;
  children: JSX.Element;
}) => {
  return (
    <div
      className={`p-1 rounded-lg shadow-md transition-all hover:ring ring-red-500 ${
        selected ? "bg-red-200 ring" : "bg-stone-100"
      }`}
    >
      {children}
    </div>
  );
};

export default App;
