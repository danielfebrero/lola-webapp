import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import imageLola from "../../lola.jpeg";
import imageDani from "../../dani.webp";
import clsx from "clsx";

interface ChatProps {
  type: "character" | "story" | "game";
  id?: string;
}

const newCharacterChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    character: "dani",
  },
];

const characterChat = [
  {
    content:
      "She sat alone in her dimly lit apartment, the hum of the city outside barely audible over the storm of thoughts in her mind. What happened to me? she wondered, her fingers tracing the edge of her coffee mug. Just days ago, she had been lost in the monotony of her routine, her creativity strangled by self-doubt. And then, she had stumbled into Muse. That gallery, that man—Andre. His words still lingered in her mind, wrapping around her like a taut thread she couldn’t untangle. He saw something in me, she thought, her cheeks warming at the memory of his gaze, steady and piercing. She had painted that night, not just with her hands but with her heart, spilling emotions she didn’t even know she’d buried. It had been terrifying, raw, and somehow freeing. But what now? she questioned, staring at the blank canvas she had brought home. The ache in her chest whispered that this was only the beginning.",
    character: "cara",
  },
  {
    content: "You should buy some new lingerie.",
    character: "user",
  },
  {
    content:
      "As she glanced at her reflection in the mirror, a playful smirk tugged at her lips. You know what? I’m going to buy myself some new lingerie—something bold, something that feels as daring as I want to be.",
    character: "cara",
  },
  {
    content:
      "She sat alone in her dimly lit apartment, the hum of the city outside barely audible over the storm of thoughts in her mind. What happened to me? she wondered, her fingers tracing the edge of her coffee mug. Just days ago, she had been lost in the monotony of her routine, her creativity strangled by self-doubt. And then, she had stumbled into Muse. That gallery, that man—Andre. His words still lingered in her mind, wrapping around her like a taut thread she couldn’t untangle. He saw something in me, she thought, her cheeks warming at the memory of his gaze, steady and piercing. She had painted that night, not just with her hands but with her heart, spilling emotions she didn’t even know she’d buried. It had been terrifying, raw, and somehow freeing. But what now? she questioned, staring at the blank canvas she had brought home. The ache in her chest whispered that this was only the beginning.",
    character: "cara",
  },
  {
    content: "You should buy some new lingerie.",
    character: "user",
  },
  {
    content:
      "As she glanced at her reflection in the mirror, a playful smirk tugged at her lips. You know what? I’m going to buy myself some new lingerie—something bold, something that feels as daring as I want to be.",
    character: "cara",
  },
];

const story = [
  {
    content:
      "The city hummed with a subtle vibrancy as Cara walked briskly through the rain-slicked streets, her canvas bag slung over one shoulder. She had spent the last two days aimlessly sketching at a café, frustrated by her inability to channel her usual inspiration. The world around her felt dim, her creativity dulled by the weight of routine and self-doubt.",
    character: "narrator",
  },
  {
    content:
      "She paused under the awning of a gallery she’d never noticed before. The name 'Muse' was etched elegantly in black script across frosted glass doors. A faint pulse of bass came from within, an almost magnetic rhythm that drew her closer. It felt out of place, this unassuming storefront hiding something far more alive within its depths. Curiosity prickled at her, and before she could overthink, she stepped inside.",
    character: "narrator",
  },
  {
    content:
      "The scent of sandalwood and faint vanilla hit her first, rich and intoxicating. The lighting was low, accented by soft candles that danced against the dark, earthy walls. A few scattered patrons sipped wine, murmuring softly as they gazed at abstract art pieces that felt more visceral than intellectual. A striking figure leaned casually against a far wall, their dark eyes gleaming in the flickering light.",
    character: "narrator",
  },
  {
    content: "“Looking for something… or someone?”",
    character: "andre",
  },
  {
    content:
      "“I—just wandered in,” she admitted, suddenly aware of her soaked jacket and the slight flush on her cheeks.",
    character: "cara",
  },
  {
    content:
      "“Then you’re exactly where you’re supposed to be.” The stranger stepped closer, offering a sly smile. “I’m Andre.”",
    character: "andre",
  },
  {
    content:
      "“Cara,” she replied, her voice catching in her throat as his gaze traveled over her, lingering not with judgement but with curiosity, as though he could read her restlessness like an open book.",
    character: "cara",
  },
  {
    content:
      "Andre gestured toward the back of the gallery, where a velvet curtain hung partially open. “Let me show you something,” he said.",
    character: "andre",
  },
  {
    content:
      "Before she could protest, he was leading her into a room that felt entirely separate from the one they’d just left. Here, the air was heavier, thick with a tension that made her pulse quicken. The walls were lined with canvases depicting moments of intimacy so raw they felt almost intrusive. Bodies entwined in shadowy suggestion, faces caught in expressions of pure abandon.",
    character: "narrator",
  },
  {
    content:
      "“What… is this place?” she whispered, her fingers brushing lightly against the edge of a frame.",
    character: "cara",
  },
  {
    content:
      "Andre tilted his head, studying her. “It’s a sanctuary for those who seek something deeper. You see, art isn’t just about paint on a canvas. It’s about emotion, vulnerability. Submission, even.”",
    character: "andre",
  },
  {
    content:
      "The word hit her like a bolt of lightning. Submission. Her mind spiraled, unbidden images flashing of herself yielding, giving up control to someone who could see through her guarded layers.",
    character: "narrator",
  },
  {
    content:
      "“You look like someone who could use inspiration,” Andre murmured, stepping closer, his voice a low thrum against her skin. “Tell me, Cara… do you trust yourself enough to let go?”",
    character: "andre",
  },
  {
    content:
      "Her lips parted, but no words came. She felt the heat of his proximity, the intoxicating pull of his presence. He reached out, his fingertips ghosting along the edge of her jaw.",
    character: "narrator",
  },
  {
    content:
      "“I can help you find what you’re looking for,” he said, his voice soft but firm. “But only if you’re willing to surrender to the experience.”",
    character: "andre",
  },
  {
    content:
      "Her heart thundered in her chest. She didn’t know what compelled her to nod, but when she did, Andre’s lips curved into a knowing smile.",
    character: "narrator",
  },
  {
    content:
      "“Good,” he said. “Come back tomorrow night. Bring nothing but yourself. And leave the rest to me.”",
    character: "andre",
  },
  {
    content: "Make them fuck",
    character: "user",
  },
  {
    content:
      "The rain had stopped when Cara stepped out of the gallery, the cool night air brushing against her flushed cheeks. Her mind raced with questions, Andre's words echoing in her head. 'Surrender to the experience.' What did that even mean? And why had she agreed so readily?",
    character: "narrator",
  },
  {
    content:
      "The following day felt like a blur. Cara wandered aimlessly through her apartment, unable to focus on her sketches or her usual routines. She kept replaying the encounter, Andre's enigmatic smile and the intensity of his gaze.",
    character: "narrator",
  },
  {
    content:
      "That evening, Cara found herself standing outside the gallery once again. She hesitated, her fingers trembling as they gripped the strap of her bag. She had left everything else behind, just as he had instructed. But now, the weight of the unknown pressed heavily on her chest.",
    character: "narrator",
  },
  {
    content:
      "The door opened before she could make a decision. Andre stood there, dressed sharply in a tailored jacket, his expression one of quiet confidence. 'I was wondering if you'd come,' he said, stepping aside to let her in.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, unable to find her voice. She stepped past him, the familiar scent of sandalwood and vanilla wrapping around her like a veil. The gallery was dimly lit, its usual patrons absent. Only the faint pulse of music remained, a haunting melody that seemed to guide her steps.",
    character: "narrator",
  },
  {
    content:
      "'Follow me,' Andre said, his tone softer now, almost reassuring. He led her past the velvet curtain once more, into the intimate room she had seen the night before. But this time, the space felt different—charged, alive.",
    character: "andre",
  },
  {
    content:
      "In the center of the room was an easel, a blank canvas waiting to be transformed. Andre gestured toward it. 'Tonight, we create together,' he said. 'No limits, no hesitation. Let your instincts guide you.'",
    character: "andre",
  },
  {
    content:
      "Cara hesitated, the weight of his words sinking in. 'I don't even know where to start,' she admitted, her voice barely above a whisper.",
    character: "cara",
  },
  {
    content:
      "'Start with yourself,' Andre replied. 'Strip away the fear, the doubt. Let the canvas see who you really are.'",
    character: "andre",
  },
  {
    content:
      "Her breath caught, the vulnerability of his request striking her deeply. Slowly, she stepped forward, her fingers trembling as they reached for the brush. Andre moved closer, his presence steady and grounding. Together, they began to paint, the strokes raw and unfiltered, their emotions bleeding onto the canvas.",
    character: "narrator",
  },
  {
    content:
      "As the night wore on, the lines between creation and connection blurred. Cara found herself letting go in ways she never imagined possible, her trust in Andre growing with every shared glance, every whispered word of encouragement.",
    character: "narrator",
  },
  {
    content:
      "When they finally stepped back to admire their work, the canvas was alive with color and texture—a reflection of everything she had been too afraid to express. Andre's hand rested lightly on her shoulder, his voice low and sincere. 'This is just the beginning,' he said.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, a small smile playing on her lips. For the first time in what felt like forever, she felt truly inspired.",
    character: "narrator",
  },
  {
    content:
      "This feels like a good step forward for their connection, but maybe there’s room to push it further later? What do you think?",
    character: "user",
  },
];

const Chat: React.FC<ChatProps> = (props) => {
  const [chatLog, setChatLog] = useState(characterChat);
  const location = useLocation();

  useEffect(() => {
    props.id === "new"
      ? setChatLog(newCharacterChat)
      : props.id === "qsqf909Ddsdf-a-random-story"
      ? setChatLog(story)
      : setChatLog(characterChat);
  }, [props]);

  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px]">
          {chatLog.map((message) =>
            message.character === "user" ? (
              <div className="flex flex-row justify-end mb-[20px]">
                <div
                  className={clsx(
                    {
                      "max-w-[60%]": location.pathname.indexOf("/story") === 0,
                      "max-w-[80%]": location.pathname.indexOf("/story") !== 0,
                    },
                    "w-fit  bg-messageBackground rounded-lg p-[10px]"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-row mb-[10px]">
                <div className="w-[30px] h-[30px] mr-[10px]">
                  {message.character !== "narrator" ? (
                    <img
                      className="rounded-full h-[30px] w-[30px] object-cover"
                      src={message.character === "cara" ? imageLola : imageDani}
                    />
                  ) : null}
                </div>
                <div className="grow max-w-[calc(100%-50px)]">
                  {message.content}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
