import { useTranslation } from "react-i18next";
import { useState } from "react";

import CloseIcon from "../../icons/close";
import Meta from "../../components/Meta";
import clsx from "clsx";

const images = () => {
  let res = [];
  for (let i = 0; i < 100; i++)
    res.push({
      original:
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/4caa45c1-91b3-45d2-9e11-e634aaa3d4ff.png",
      large:
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/f71efee2-e0e7-41fa-8831-625c986ad4a0.png",
      medium:
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/3f6cc54f-00db-4962-9052-114d468314ea.png",
      small:
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/6eb4beb1-5bbf-46e6-99d1-c90cf0c6557f.png",
    });

  return res;
};

const ExploreImagesPage: React.FC = (props) => {
  const { t } = useTranslation();
  const [imageViewing, setImageViewing] = useState<string | null>(null);

  return (
    <>
      <Meta title={t("Images")} />
      <div
        className={clsx(
          { hidden: !imageViewing },
          "fixed h-[calc(100vh-60px)] w-[calc(100vw-60px)] top-[30px] left-[30px] bg-slate-200"
        )}
      >
        <div
          onClick={() => setImageViewing(null)}
          className="fixed top-[40px] right-[40px] h-[48px] w-[48px] cursor-pointer text-textSecondary dark:text-darkTextSecondary"
        >
          <CloseIcon />
        </div>
        {imageViewing && (
          <img
            className="h-full w-full object-contain"
            src={imageViewing}
            alt={imageViewing}
          />
        )}
      </div>
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            <div className="grid md:grid-cols-5 grid grid-cols-3 gap-4">
              {images().map((i) => (
                <div
                  className="w-full cursor-pointer"
                  onClick={() => setImageViewing(i.original)}
                >
                  <img src={i.large} alt={i.original} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreImagesPage;
