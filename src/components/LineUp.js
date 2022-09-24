import React from 'react';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asDateColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';

export default function LineUp() {
    const data = React.useMemo(
      () => [
        {
          name: 'Panchito Green',
          age: 10,
          shirtSize: 'S',
          birthday: new Date(2011, 1, 1),
        },
        {
          name: 'Rubia Robker',
          age: 25,
          shirtSize: 'M',
          birthday: new Date(1996, 4, 13),
        },
        {
          name: 'Micheil Sappell',
          age: 50,
          shirtSize: 'L',
          birthday: new Date(1971, 8, 23),
        },
        {
          name: 'Geoffrey Sprason',
          age: 30,
          shirtSize: 'M',
          birthday: new Date(1991, 11, 5),
        },
        {
          name: 'Grissel Rounsefull',
          age: 21,
          shirtSize: 'S',
          birthday: new Date(2000, 6, 30),
        },
      ],
      []
    );
  
    const columns = React.useMemo(
      () => [asTextColumn('name'), asNumberColumn('age'), asCategoricalColumn('shirtSize'), asDateColumn('birthday')],
      []
    );
  
    const features = React.useMemo(() => featureDefault(), []);
  
    return <LineUpLite data={data} columns={columns} features={features} />;
  }