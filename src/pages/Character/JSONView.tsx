import ReactJson from "react-json-view";

import "./JSONView.css";

const json = {
  name: "Dani",
  age: 32,
  gender: "Homme",
  appearance: {
    hair_color: "Noir",
    eye_color: "Marron",
    height: 1.78,
    body_type: "Athlétique",
    skin_tone: "Pâle",
    distinctive_features: [
      {
        feature: "Montre élégante",
        description:
          "Une montre en acier inoxydable, minimaliste et sophistiquée.",
      },
    ],
  },
  personality: {
    traits: ["Confident", "Mystérieux", "Charismatique"],
    introvert_extrovert_scale: 6,
    moral_alignment: "Chaotique Neutre",
    hobbies: ["Mode", "Photographie", "Exploration urbaine"],
  },
  background: {
    origin: "Paris, France",
    profession: "Créateur de contenu",
    notable_events: [
      {
        event: "A remporté un concours de photographie à 28 ans",
        impact:
          "A renforcé sa confiance et sa passion pour l'exploration créative.",
      },
    ],
  },
  relationships: [
    {
      name: "Alexandra",
      relation_type: "Amie proche",
      status: "Actif",
      history:
        "Ils se sont rencontrés lors d'une exposition photo il y a 4 ans.",
    },
  ],
  preferences: {
    likes: [
      "Photographies artistiques",
      "Accessoires élégants",
      "Récits d'aventure",
    ],
    dislikes: ["Conformisme", "Critiques non constructives"],
    romantic_orientation: "Hétérosexuel",
    sexual_preferences: [
      {
        preference: "Romantisme audacieux",
        description:
          "Préfère des récits où l'audace et l'intimité se rencontrent.",
      },
    ],
  },
  skills: {
    physical: [
      {
        name: "Parkour",
        proficiency: 7,
      },
    ],
    mental: [
      {
        name: "Créativité",
        proficiency: 9,
      },
    ],
    social: [
      {
        name: "Communication",
        proficiency: 8,
      },
    ],
  },
  dynamic_attributes: {
    confidence_level: 8,
    stress_level: 3,
    emotional_state: "Détendu",
  },
  story_context: {
    role: "Mentor",
    current_motivation: "Trouver de nouvelles inspirations pour ses créations",
    associated_events: [
      {
        event_id: "fashion_week_paris",
        relationship_to_event: "Invité spécial",
      },
    ],
  },
  meta_data: {
    creation_date: "2024-12-14",
    last_modified: "2024-12-14",
    created_by_user_id: "admin",
  },
};

interface JSONViewProps {
  type: "character" | "story";
  id?: string;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <ReactJson
          src={json}
          theme="bright:inverted"
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export default JSONView;
