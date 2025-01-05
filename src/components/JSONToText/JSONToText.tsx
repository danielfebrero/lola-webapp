import React from "react";

interface JSONToTextProps {
  data: Record<string, any>; // The JSON object to display
  title?: string; // Optional title for the component
}

const JSONToText: React.FC<JSONToTextProps> = ({ data, title }) => {
  /**
   * Recursive function to render JSON objects or arrays.
   */
  const renderData = (value: any): JSX.Element => {
    if (Array.isArray(value)) {
      // Render arrays
      return (
        <ul className="list-disc ml-5">
          {value.map((item, index) => (
            <li key={index}>{renderData(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === "object" && value !== null) {
      // Render objects
      return (
        <div className="md:ml-5 pl-3">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mb-2">
              {val ? (
                <>
                  <strong>{capitalize(key)}:</strong> {renderData(val)}
                </>
              ) : (
                <>{capitalize(key)}</>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // Render primitive values
      return <span>{value?.toString() || ""}</span>;
    }
  };

  /**
   * Utility function to capitalize a string.
   */
  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="font-sans leading-relaxed">
      {title && (
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
          {title}
        </h2>
      )}
      {renderData(data)}
    </div>
  );
};

export default JSONToText;
