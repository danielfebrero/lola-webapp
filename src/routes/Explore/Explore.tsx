import { useTranslation } from "react-i18next";

import Meta from "../../components/Meta";
import Chat from "../../components/Chat";

interface ExplorePageProps {
  type: string;
}

const content = [
  {
    threadId: "abcdef",
    title: "Visiting New-York",
    messages: [
      {
        role: "user",
        content: "Lola visits New York with her friend Flora.",
      },
      {
        role: "assistant",
        content:
          "Chapitre 1 : Un départ inattendu\n\nLola se sentait nerveuse au bord du trottoir, son sac à dos pesant sur ses épaules. Elle regarda autour d'elle, cherchant Flora qui devait arriver d'une minute à peine. La gare routière de Port Authority était en effervescence, les gens déchargeant leurs bagages et les porteurs de valises s'éloignant en courant vers les taxis. Elle espérait que Flora n'avait pas oublié leur rendez-vous.\n\nEnfin, elle aperçut sa meilleure amie, vêtue d'un manteau bleu marine et coiffée d'un chapeau aux plumes, qui marchait vers elle avec un large sourire. \"Hey, Lola! Je suis désolée pour la retard!\" s'exclama-t-elle en embrassant Lola sur les deux joues.\n\n— \"Pas de problème, je me disais que tu avais peut-être pris un taxi\", répondit Lola en prenant son sac et en l'accrochant à son épaule.\n\nFlora jeta un coup d'œil alentour, comme si elle cherchait quelque chose. — \"Alors, où allons-nous loger? J'ai réservé un hôtel dans Greenwich Village.\"\n\nLola consulta son téléphone. — \"Oui, je vois bien. L'hôtel Lafayette, c'est pas loin d'ici. On peut y aller à pied.\" Elles traversèrent la rue ensemble, entourées par les sirènes des voitures et les klaxons des taxis.\n\nAu bout de quelques minutes, elles arrivèrent devant un petit immeuble de six étages, orné d'une enseigne lumineuse. Lola sentit un peu d'inquiétude monter en elle ; cet hôtel avait l'air un peu trop discret pour son goût. Mais Flora, toujours optimiste, entra directement dans l'entrée, prête à découvrir les secrets de ce charmant quartier new-yorkais.\n\nLe réceptionniste, un homme aux cheveux grisonnants, les accueillit avec un grand sourire. — \"Bienvenue au Lafayette Hotel, mesdames. Je vais vous donner vos clés. Vous avez réservé une chambre double avec vue sur la ville.\"\n\nLola accepta les clés sans poser de questions, mais elle se demandait bien pourquoi Flora avait choisi cet endroit si exigu et si tranquille. Pourtant, Flora semblait ravie de cette découverte, et Lola ne voulait pas gâcher son séjour à New York en la décevant. Alors, elle sourit et suivit Flora jusqu'à l'ascenseur, prête à explorer la ville avec son amie.",
      },
    ],
  },
];

const ExplorePage: React.FC<ExplorePageProps> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t(props.type === "best" ? "Best content" : "Latest")} />
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)]">
          <div className="grow overflow-y-scroll no-scrollbar justify-center flex px-5">
            {content.map((c) => (
              <div className="flex flex-col w-full max-w-[715px]">
                <div className="font-bold md:px-[30px] mb-[20px]">
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                  {c.title}
                </div>
                <div className="max-h-[300px] max-w-[715px] w-full overflow-hidden">
                  <Chat chatLog={c.messages} isChatLoading={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
