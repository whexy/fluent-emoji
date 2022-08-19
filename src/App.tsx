import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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

  const [eyes, setEyes] = useState<number>(-1);
  const [head, setHead] = useState<number>(-1);
  const [eyebrows, setEyebrows] = useState<number>(-1);
  const [mouth, setMouth] = useState<number>(-1);
  const [details, setDetails] = useState<number>(-1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getInt = (s: string) => parseInt(params.get(s) || '-1');

    setEyes(getInt('eyes'));
    setHead(getInt('head'));
    setEyebrows(getInt('eyebrows'));
    setMouth(getInt('mouth'));
    setDetails(getInt('details'));
    draw();
  }, []);

  const draw = () => {
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const drawElement = (idx: number, gallery: string[]) => {
      if (idx >= 0) {
        var image = new Image();
        image.src = gallery[idx];
        image.onload = () => {
          canvas.getContext('2d')?.drawImage(image, 0, 0, 144, 144);
        };
      }
    };
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    drawElement(head, HeadSVGs);
    drawElement(eyes, EyeSVGs);
    drawElement(eyebrows, EyeBrowsSVGs);
    drawElement(mouth, MouthSVGs);
    drawElement(details, DetailsSVGs);
  };

  useEffect(() => draw(), [eyes, head, eyebrows, mouth, details]);

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
    <div className="flex items-start justify-center gap-4 bg-gray-100 p-4">
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
      </div>
      <div className="sticky top-28 ">
        <div className="flex-shrink-0 rounded-lg bg-white">
          <canvas id="canvas" height={144} width={144} />
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="mt-4 rounded-lg bg-white px-4 py-2"
            onClick={() => goWild()}>
            🤪 Go Wild
          </button>
          <CopyToClipboard
            text={`${window.location.origin}?eyes=${eyes}&head=${head}&eyebrows=${eyebrows}&mouth=${mouth}&details=${details}`}>
            <button className="mt-4 rounded-lg bg-white px-4 py-2">
              👯‍♀️ Share
            </button>
          </CopyToClipboard>
        </div>
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
