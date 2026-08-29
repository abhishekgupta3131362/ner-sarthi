import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/* =========================================================
   LEAFLET MARKER FIX
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


/* =========================================================
   VEHICLE MAP
========================================================= */

function VehicleMap({
  vehicles = [],
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* MAP HEADER */}

      <div className="p-4 border-b border-slate-800">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-widest text-slate-600">
              GIS Fleet Monitoring
            </p>

            <h2 className="text-sm font-semibold text-white mt-1">
              Live Vehicle Locations
            </h2>

          </div>


          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-[8px] text-emerald-400 uppercase">
              Live
            </span>

          </div>

        </div>

      </div>


      {/* MAP */}

      <div className="h-[500px]">

        <MapContainer
          center={[26.1445, 91.7362]}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {vehicles.map((vehicle) => {

            if (
              !Array.isArray(
                vehicle.position
              ) ||
              vehicle.position.length < 2
            ) {
              return null;
            }


            return (

              <Marker
                key={vehicle.id}
                position={[
                  Number(
                    vehicle.position[0]
                  ),
                  Number(
                    vehicle.position[1]
                  ),
                ]}
              >

                <Popup>

                  <div className="text-sm">

                    <strong>
                      {vehicle.id}
                    </strong>

                    <br />

                    Status:{" "}
                    {vehicle.status}

                    <br />

                    Speed:{" "}
                    {vehicle.speed} km/h

                    <br />

                    Driver:{" "}
                    {vehicle.driver}

                    <br />

                    Destination:{" "}
                    {vehicle.destination ||
                      "Northeast Corridor"}

                  </div>

                </Popup>

              </Marker>

            );

          })}

        </MapContainer>

      </div>

    </div>
  );
}


export default VehicleMap;