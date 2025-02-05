path: /Users/dannybengal/dev/lola/webapp/src/pages/18/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const EighteenPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Latest">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default EighteenPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/[...slug]/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const LandingPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Latest">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default LandingPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/_app.tsx
```tsx
// src/pages/_app.tsx
import { AppProps } from "next/app";
import Head from "next/head";

import "../index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          Fabularius AI - Choose your own adventure, storyteller, chatbot,
          character and image generator.
        </title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/_document.tsx
```tsx
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#3ccccf" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/logo512.png" />
          <meta
            name="description"
            content="A Choose Your Own Adventure AI game where you are the hero and storyteller."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/character/[threadId]/index.tsx
```tsx
// src/pages/character/[threadId]/index.tsx

import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import CharacterLayout from "../../../components/Layouts/Character";
import PageLayout from "../../../components/Layouts/Page";
import { Character } from "../../../types/characters";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface CharacterPageProps {
  data: Character;
  isOwner: boolean;
  threadId: string;
}

const CharacterPage: NextPage<CharacterPageProps> = ({
  data,
  isOwner,
  threadId,
}) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          {data.json?.name
            ? data.json?.name +
              " on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."
            : "New character on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."}
        </title>
      </Head>
      <PageLayout headerDropdownLabel={"Character"}>
        {threadId === "new" ? (
          <CharacterLayout />
        ) : (
          <CharacterLayout
            character={data}
            chatLog={data.chatLog}
            isOwner={isOwner}
            threadId={threadId}
          />
        )}
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;
  const host = context.req.headers.host || "";
  const isDevDomain =
    host.includes("dev.fabularius.ai") || host.includes("localhost");

  if (threadId === "new")
    return { props: { data: { thread_id: "new" }, threadId } };

  const res = await fetch(
    isDevDomain
      ? `https://devapi.fabularius.ai/dev/character?threadId=${threadId}`
      : `https://prodapi.fabularius.ai/prod/character?threadId=${threadId}`
  );

  if (!res.ok) {
    return { props: { data: { thread_id: "new" }, threadId } };
  }

  const result = await res.json();

  return {
    props: {
      data: result.data,
      isOwner: result.isOwner,
      threadId,
    },
  };
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/checkout/order-canceled/[orderId]/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../../../components/Layouts/Page";

const App = dynamic(() => import("../../../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Order canceled">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/checkout/order-received copy/[orderId]/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../../../components/Layouts/Page";

const App = dynamic(() => import("../../../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Order received">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/explore/best.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Explore best content on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Best Content">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/explore/images.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Explore images on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Images">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/explore/latest.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Explore latest content on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Latest">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/game/[gameId]/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../../components/Layouts/Page";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

const GamePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel={"Choose your own adventure"}>
        {""}
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/index.tsx
```tsx
import { Head } from "next/document";
import dynamic from "next/dynamic";
import PageLayout from "../components/Layouts/Page";

const App = dynamic(() => import("../App"), {
  ssr: false,
});

const CharacterPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Fabularius AI - Choose your own adventure, storyteller, chatbot,
          character and image generator.
        </title>
      </Head>
      <PageLayout>{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/login/success.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const CharacterPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel={"Character"}>{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/lola/new.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const NewLolaPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Lola chatbot on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Lola">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default NewLolaPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/pricing/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Pricing">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/story/[threadId]/index.tsx
```tsx
import dynamic from "next/dynamic";

import PageLayout from "../../../components/Layouts/Page";
import { GetServerSideProps } from "next";
import Head from "next/head";
import StoryLayout from "../../../components/Layouts/Story";
import NewStoryLayout from "../../../components/Layouts/NewStory";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface StoryPageProps {
  data: Story;
  threadId: string;
  title: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ data, title, threadId }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          {title
            ? title +
              " - Story on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."
            : "New story on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."}
        </title>
      </Head>
      <PageLayout headerDropdownLabel={"Story"}>
        {threadId === "new" ? (
          <NewStoryLayout />
        ) : (
          <StoryLayout chatLog={data.chatLog} />
        )}
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;
  const host = context.req.headers.host || "";
  const isDevDomain =
    host.includes("dev.fabularius.ai") || host.includes("localhost");

  if (threadId === "new")
    return { props: { data: { thread_id: "new" }, threadId } };

  const res = await fetch(
    isDevDomain
      ? `https://devapi.fabularius.ai/dev/story?threadId=${threadId}`
      : `https://prodapi.fabularius.ai/prod/story?threadId=${threadId}`
  );

  console.log({ res });

  if (!res.ok) {
    return { props: { data: { thread_id: "new" }, threadId } };
  }

  const result = await res.json();

  console.log({ result });

  return {
    props: {
      data: result.data,
      title: result.title,
      threadId,
    },
  };
};

export default StoryPage;

```

