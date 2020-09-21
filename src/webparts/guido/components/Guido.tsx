import * as React from 'react';
import styles from './Guido.module.scss';
import { IGuidoWebPartProps } from '../GuidoWebPart';
import { escape } from '@microsoft/sp-lodash-subset';
import * as Fabric from 'office-ui-fabric-react';
import { nanoid } from 'nanoid';
import { parse } from 'query-string';

export default function GuidoWebPart(props: IGuidoWebPartProps) {

  const dev = () => {
    console.log("nanoid: ", nanoid(5));
    let parsed = parse(location.search);
    console.log("URL params: ", parsed);
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <span className={styles.title}>Welcome to SharePoint!</span>
          <p>Customize SharePoint experiences using Web Parts.</p>
          <p>{escape(props.description)}</p>
          <Fabric.PrimaryButton onClick={dev}>Dev</Fabric.PrimaryButton>
        </div>
      </div>
    </div>
  );
}
