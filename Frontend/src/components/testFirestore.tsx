import { useState, useEffect } from "preact/hooks";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";

export default function TestFirestore() {
  const [FirebaseHeaderSensor, setFirebaseHeaderSensor] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ref = collection(database, "headerSensors");
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFirebaseHeaderSensor(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Firebase Header Sensors</h1>
      <ul>
        {FirebaseHeaderSensor.map((item) => (
          <li key={item.id}>
            {item.Sensor}
          </li>
        ))}
      </ul>
    </div>
  );
}
