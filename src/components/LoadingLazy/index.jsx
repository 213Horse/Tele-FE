import { Loading } from '../Loading';
import styles from './LoadingLazy.module.css';

function LoadingLazy() {
  return (
    <div className={styles.loadinglazy}>
      <Loading
        size={100}
        color='#1775f1'
      />
    </div>
  );
}

export default LoadingLazy;
