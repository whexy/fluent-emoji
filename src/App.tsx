import { useState } from 'react';

const assets = import.meta.glob('./assets/**/*.svg', {
  as: 'url',
  eager: true,
});

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
    <div className="my-5 rounded-lg bg-white p-8">
      <h2 className="pb-2 text-xl">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {svg.map((path, idx) => (
          <div key={idx} onClick={() => setSelected(idx)}>
            <SelectButton selected={selected == idx}>
              <img src={path} className="h-12 w-12" />
            </SelectButton>
          </div>
        ))}
        <div onClick={() => setSelected(-1)}>
          <SelectButton selected={selected == -1}>
            <div className="h-12 w-12" />
          </SelectButton>
        </div>
      </div>
    </div>
  );
}

function App() {
  const EyeSVGs: string[] = [];
  const EyeBrowsSVGs: string[] = [];
  const HeadSVGs: string[] = [];
  const MouthSVGs: string[] = [];
  const DetailsSVGs: string[] = [];

  for (const module in assets) {
    const path = assets[module];
    if (module.includes('eyes/')) {
      EyeSVGs.push(path);
    } else if (module.includes('eyebrows/')) {
      EyeBrowsSVGs.push(path);
    } else if (module.includes('head/')) {
      HeadSVGs.push(path);
    } else if (module.includes('mouth/')) {
      MouthSVGs.push(path);
    } else if (module.includes('details/')) {
      DetailsSVGs.push(path);
    }
  }

  const [eyes, setEyes] = useState<number>(0);
  const [head, setHead] = useState<number>(0);
  const [eyebrows, setEyebrows] = useState<number>(0);
  const [mouth, setMouth] = useState<number>(0);
  const [details, setDetails] = useState<number>(0);

  const goWild = () => {
    const getRandom = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };
    setEyes(getRandom(-1, EyeSVGs.length));
    setHead(getRandom(0, HeadSVGs.length));
    setEyebrows(getRandom(-1, EyeBrowsSVGs.length));
    setMouth(getRandom(-1, MouthSVGs.length));
    setDetails(getRandom(-1, DetailsSVGs.length));
  };

  return (
    <div className="flex justify-center gap-4 bg-gray-100 p-4">
      <div className="max-w-3xl">
        <h1 className="pt-8 text-center text-3xl font-bold">
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
        <div className="">
          <button
            className="rounded-lg bg-white px-4 py-2"
            onClick={() => goWild()}>
            Go Wild
          </button>
        </div>
      </div>
      <div className="sticky top-28 h-36 w-36 flex-shrink-0 rounded-lg bg-white">
        {head >= 0 && (
          <img
            src={HeadSVGs[head]}
            className="absolute top-0 right-0 left-0 bottom-0 m-auto h-20 w-20"
          />
        )}
        {eyes >= 0 && (
          <img
            src={EyeSVGs[eyes]}
            className="absolute top-0 right-0 left-0 bottom-0 m-auto h-20 w-20"
          />
        )}
        {eyebrows >= 0 && (
          <img
            src={EyeBrowsSVGs[eyebrows]}
            className="absolute top-0 right-0 left-0 bottom-0 m-auto h-20 w-20"
          />
        )}
        {mouth >= 0 && (
          <img
            src={MouthSVGs[mouth]}
            className="absolute top-0 right-0 left-0 bottom-0 m-auto h-20 w-20"
          />
        )}
        {details >= 0 && (
          <img
            src={DetailsSVGs[details]}
            className="absolute top-0 right-0 left-0 bottom-0 m-auto h-20 w-20"
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
      className={`rounded-lg p-1 shadow-md ring-red-500 transition-all hover:ring ${
        selected ? 'bg-red-200 ring' : 'bg-stone-100'
      }`}>
      {children}
    </div>
  );
};

export default App;
