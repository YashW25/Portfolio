import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        aria-label={`View project: ${props.alt || 'Work project'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link" aria-hidden="true">
            <MdArrowOutward />
          </div>
        )}
        <img src={props.image} alt={props.alt || "Portfolio Project Image"} loading="lazy" decoding="async" />
        {isVideo && <video src={video} autoPlay muted playsInline loop title={props.alt || "Project Video"}></video>}
      </a>
    </div>
  );
};

export default WorkImage;
