import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  setSelected: (idx: number) => void;
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

type Combination = {
  eyes: number;
  eyebrows: number;
  head: number;
  mouth: number;
  details: number;
};

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

  const [combination, setCombination] = useState<Combination>({
    eyes: -1,
    eyebrows: -1,
    head: -1,
    mouth: -1,
    details: -1,
  });

  const [canvasURL, setCanvasURL] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getInt = (s: string) => parseInt(params.get(s) || '-1');

    const newCombination: Combination = {
      eyes: getInt('eyes'),
      eyebrows: getInt('eyebrows'),
      head: getInt('head'),
      mouth: getInt('mouth'),
      details: getInt('details'),
    };

    setCombination(newCombination);
  }, []);

  useEffect(() => {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    var ctx = canvas.getContext('2d');
    const drawElement = async (idx: number, gallery: string[]) => {
      if (idx >= 0) {
        var image = new Image();
        image.src = gallery[idx];
        await image.decode();
        ctx?.drawImage(image, 0, 0, 1024, 1024);
      }
    };
    const draw = async () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      await drawElement(combination.head, HeadSVGs);
      await drawElement(combination.eyes, EyeSVGs);
      await drawElement(combination.eyebrows, EyeBrowsSVGs);
      await drawElement(combination.mouth, MouthSVGs);
      await drawElement(combination.details, DetailsSVGs);
      setCanvasURL(canvas.toDataURL());
    };
    draw().catch(console.error);
  }, [combination]);

  const goWild = () => {
    const getRandom = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };
    const eyes = getRandom(-1, EyeSVGs.length);
    const head = getRandom(0, HeadSVGs.length);
    const eyebrows = getRandom(-1, EyeBrowsSVGs.length);
    const mouth = getRandom(-1, MouthSVGs.length);
    const details = getRandom(-1, DetailsSVGs.length);
    setCombination({
      eyes: eyes,
      eyebrows: eyebrows,
      head: head,
      mouth: mouth,
      details: details,
    });
  };

  return (
    <div className="bg-gray-100">
      <h1 className="pt-8 text-center text-3xl font-bold">
        Fluent Emoji Maker
      </h1>
      <div className="flex items-start justify-center gap-4 p-4">
        <div className="max-w-3xl">
          <Area
            title="Head"
            svg={HeadSVGs}
            selected={combination.head}
            setSelected={(idx: number) => {
              setCombination((c) => {
                return { ...c, head: idx };
              });
            }}
          />
          <Area
            title="Eyes"
            svg={EyeSVGs}
            selected={combination.eyes}
            setSelected={(idx: number) => {
              setCombination((c) => {
                return { ...c, eyes: idx };
              });
            }}
          />
          <Area
            title="Eyebrows"
            svg={EyeBrowsSVGs}
            selected={combination.eyebrows}
            setSelected={(idx: number) => {
              setCombination((c) => {
                return { ...c, eyebrows: idx };
              });
            }}
          />
          <Area
            title="Mouth"
            svg={MouthSVGs}
            selected={combination.mouth}
            setSelected={(idx: number) => {
              setCombination((c) => {
                return { ...c, mouth: idx };
              });
            }}
          />
          <Area
            title="Details"
            svg={DetailsSVGs}
            selected={combination.details}
            setSelected={(idx: number) => {
              setCombination((c) => {
                return { ...c, details: idx };
              });
            }}
          />
        </div>
        <div className="sticky top-28 ">
          <div className="h-[144px] w-[144px] flex-shrink-0 rounded-lg bg-white">
            {canvasURL === '' || <img src={canvasURL} className="object-fit" />}
          </div>
          <div className="flex flex-col space-y-2">
            <button
              className="mt-4 rounded-lg bg-white px-4 py-2"
              onClick={() => goWild()}>
              🤪 Go Wild
            </button>
            <CopyToClipboard
              text={`${window.location.origin}?eyes=${combination.eyes}&head=${combination.head}&eyebrows=${combination.eyebrows}&mouth=${combination.mouth}&details=${combination.details}`}>
              <button className="mt-4 rounded-lg bg-white px-4 py-2">
                👯‍♀️ Share
              </button>
            </CopyToClipboard>
          </div>
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
