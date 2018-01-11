// look here https://gorangajic.github.io/react-icons/md.html
// for icons
import * as reactIconPack from 'react-icons/lib/md';

export default ( props ) => {
  const iconName = 'Md' + props.name.replace(/(^|-)(\w)/g, (m0, m1, m2) =>
    m2.toUpperCase());
  return reactIconPack[iconName]();
}
