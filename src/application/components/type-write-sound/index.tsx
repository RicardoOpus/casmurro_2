import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import keyCenter from '../../../../public/sounds/type_center.mp3';
import keyLeft75 from '../../../../public/sounds/type_left_75.mp3';
import keyLeft95 from '../../../../public/sounds/type_left_95.mp3';
import keyRight75 from '../../../../public/sounds/type_right_75.mp3';
import keyRight95 from '../../../../public/sounds/type_right_95.mp3';
import keyBackspace from '../../../../public/sounds/type_backspace.mp3';
import keySpace from '../../../../public/sounds/type_space.mp3';
import keyReturn from '../../../../public/sounds/type_bell.mp3';
import IrootStateProject from '../../../interfaces/IRootStateProject';

function TypeWriterSound() {
  const { typeWriterVolume } = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.projectSettings));
  const audioRef = useRef(new Audio(keyCenter));
  const audioLeft75 = useRef(new Audio(keyLeft75));
  const audioLeft95 = useRef(new Audio(keyLeft95));
  const audioRight75 = useRef(new Audio(keyRight75));
  const audioRight95 = useRef(new Audio(keyRight95));
  const audioBackspace = useRef(new Audio(keyBackspace));
  const audioSpace = useRef(new Audio(keySpace));
  const audiReturn = useRef(new Audio(keyReturn));
  useEffect(() => {
    audioRef.current.volume = typeWriterVolume;
    audioLeft75.current.volume = typeWriterVolume;
    audioLeft95.current.volume = typeWriterVolume;
    audioRight75.current.volume = typeWriterVolume;
    audioRight95.current.volume = typeWriterVolume;
    audioBackspace.current.volume = typeWriterVolume;
    audioSpace.current.volume = typeWriterVolume;
    audiReturn.current.volume = typeWriterVolume;

    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      switch (key) {
        case 'Enter':
          audiReturn.current.currentTime = 0;
          audiReturn.current.play();
          break;
        case 'Backspace':
          audioBackspace.current.currentTime = 0;
          audioBackspace.current.play();
          break;
        case ' ':
          audioSpace.current.currentTime = 0;
          audioSpace.current.play();
          break;
        case 'q':
        case 'a':
        case 'z':
        case 'Tab':
          audioLeft95.current.currentTime = 0;
          audioLeft95.current.play();
          break;
        case 'w':
        case 'e':
        case 's':
        case 'd':
        case 'x':
        case 'c':
          audioLeft75.current.currentTime = 0;
          audioLeft75.current.play();
          break;
        case 'p':
        case 'ç':
        case '.':
        case '[':
        case ']':
        case '?':
          audioRight95.current.currentTime = 0;
          audioRight95.current.play();
          break;
        case 'o':
        case 'i':
        case 'l':
        case 'k':
        case ',':
        case 'm':
          audioLeft75.current.currentTime = 0;
          audioLeft75.current.play();
          break;
        default:
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          break;
      }
    };
    const textScene = document.getElementById('innerWriterContainer');
    if (textScene) {
      textScene.addEventListener('keydown', handleKeyPress);
    }
    return () => {
      textScene?.removeEventListener('keydown', handleKeyPress);
    };
  }, [typeWriterVolume]);

  return null;
}

export default TypeWriterSound;
