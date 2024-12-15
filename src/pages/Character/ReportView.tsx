import Markdown from "markdown-to-jsx";

import "./ReportView.css";

const markdownText = `
# Dani

## Identification
- **Name**: Dani
- **Age**: 32
- **Gender**: Male

---

## Appearance
- **Hair Color**: Black  
- **Eye Color**: Brown  
- **Height**: 1.78 m  
- **Body Type**: Athletic  
- **Skin Tone**: Pale  

### Distinctive Features
- **Elegant Watch**:  
  - A stainless steel watch, minimalist and sophisticated.  

---

## Personality
- **Traits**:  
  - Confident  
  - Mysterious  
  - Charismatic  
- **Introvert-Extrovert Scale**: 6  
- **Moral Alignment**: Chaotic Neutral  

### Hobbies
- Fashion  
- Photography  
- Urban Exploration  

---

## Background
- **Origin**: Paris, France  
- **Profession**: Content Creator  

### Notable Events
1. **Event**: Won a photography contest at 28  
   - **Impact**: Strengthened his confidence and passion for creative exploration.  

---

## Relationships
- **Name**: Alexandra  
  - **Relation Type**: Close Friend  
  - **Status**: Active  
  - **History**: They met during a photography exhibition 4 years ago.  

---

## Preferences
- **Likes**:  
  - Artistic photography  
  - Elegant accessories  
  - Adventure stories  

- **Dislikes**:  
  - Conformity  
  - Non-constructive criticism  

- **Romantic Orientation**: Heterosexual  

### Sexual Preferences
- **Bold Romance**:  
  - Prefers stories where boldness and intimacy come together.  

---

## Skills

### Physical Skills
- **Parkour**: Proficiency 7  

### Mental Skills
- **Creativity**: Proficiency 9  

### Social Skills
- **Communication**: Proficiency 8  

---

## Dynamic Attributes
- **Confidence Level**: 8  
- **Stress Level**: 3  
- **Emotional State**: Relaxed  

---

## Story Context
- **Role**: Mentor  
- **Current Motivation**: Finding new inspiration for his creations  

### Associated Events
- **Event ID**: \`fashion_week_paris\`  
  - **Relationship to Event**: Special Guest  

---

## Meta Data
- **Creation Date**: 2024-12-14  
- **Last Modified**: 2024-12-14  
- **Created By User ID**: admin  

`;

interface ReportViewProps {
  type: "character" | "story";
  id?: string;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <Markdown>{markdownText}</Markdown>
      )}
    </div>
  );
};

export default ReportView;
