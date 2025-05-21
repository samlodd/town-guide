import React, { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("");
  const [modalData, setModalData] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    fetch("/src/data/offadata.json")
      .then((res) => res.json())
      .then(setData);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowInstall(false));
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filterText = (text) =>
    filter ? text.toLowerCase().includes(filter.toLowerCase()) : true;

  if (!data) return <div className="p-6 text-center">Loading Offa data...</div>;

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-4">Offa Town Guide</h1>

      {showInstall && (
        <div className="text-center mb-4">
          <button
            onClick={handleInstall}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Install App
          </button>
        </div>
      )}

      <nav className="flex flex-wrap gap-3 justify-center mb-6">
        {[
          "Past Heroes",
          "Sports Facilities",
          "Past Olofa of Offa",
          "District Heads",
          "Offa Descendants Union - Current Executives",
          "Professors from Offa",
          "Fun Facts About Offa",
          "Job Vacancies",
          "Hotels in Offa",
          "Public Schools (Tertiary)",
          "Public Schools (Secondary)",
          "Public Schools (Primary)",
          "Private Tertiary Institution",
          "Private Secondary Schools",
          "Private Primary Schools",
        ].map((section) => (
          <button
            key={section}
            onClick={() => scrollTo(section)}
            className="text-blue-600 hover:underline text-sm"
          >
            {section}
          </button>
        ))}
      </nav>

      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search by name, type, etc..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full max-w-md"
        />
      </div>

      <GoogleMapSection data={data.Sports_Facilities.concat(data.Hotels)} />

      {renderSections(data, filterText, setModalData)}

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-2 right-4 text-gray-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-2">{modalData.title}</h3>
            {modalData.subtitle && (
              <p className="text-sm text-gray-500 mb-2">{modalData.subtitle}</p>
            )}
            <p className="text-gray-700 text-sm">{modalData.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GoogleMapSection({ data }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-2 border-b pb-2">Map of Offa</h2>
      <div className="w-full h-96">
        <iframe
          title="Offa Map"
          width="100%"
          height="100%"
          className="rounded-lg"
          loading="lazy"
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Offa,Kwara,Nigeria&zoom=13"
        ></iframe>
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </section>
  );
}

function Card({ title, subtitle, text, onClick }) {
  return (
    <div
      className="bg-white border shadow rounded-xl p-4 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 mb-1">{subtitle}</p>}
      <p className="text-sm text-gray-700 truncate">{text}</p>
    </div>
  );
}

function renderSections(data, filterText, setModalData) {
  const show = (items, cb) =>
    items
      .filter(cb)
      .map((item, i) => (
        <Card
          key={i}
          title={item.name || item.position || `Item ${i + 1}`}
          subtitle={item.type || item.title || item.field || ""}
          text={
            item.description || item.text || item.biography || "No description"
          }
          onClick={() =>
            setModalData({
              title: item.name || item.position,
              subtitle: item.type || item.title,
              text:
                item.description || item.text || item.biography || "No details",
            })
          }
        />
      ));

  return (
    <>
      <Section id="Past Heroes" title="Past Heroes">
        {show(data.Past_Heroes, (h) => filterText(h.name))}
      </Section>
      <Section id="Sports Facilities" title="Sports Facilities">
        {show(data.Sports_Facilities, (f) => filterText(f.name))}
      </Section>
      <Section id="Past Olofa of Offa" title="Past Olofa of Offa">
        {show(data.Past_Olofa_of_Offa.rulers, (r) => filterText(r.name))}
      </Section>
      <Section id="District Heads" title="District Heads">
        {show(data.District_Heads.districts, (d) => filterText(d.name))}
      </Section>
      <Section
        id="Offa Descendants Union - Current Executives"
        title="Offa Descendants Union - Current Executives"
      >
        {show(
          data.Offa_Descendants_Union.current_executives,
          (e) => filterText(e.name)
        )}
      </Section>
      <Section id="Professors from Offa" title="Professors from Offa">
        {show(data.Professors, (p) => filterText(p.name))}
      </Section>
      <Section id="Fun Facts About Offa" title="Fun Facts About Offa">
        {data.Fun_Facts.filter((f) => filterText(f)).map((fact, i) => (
          <Card
            key={i}
            title={`Fun Fact #${i + 1}`}
            text={fact}
            onClick={() =>
              setModalData({
                title: `Fun Fact #${i + 1}`,
                text: fact,
              })
            }
          />
        ))}
      </Section>
      <Section id="Job Vacancies" title="Job Vacancies">
        {show(data.Job_Vacancies, (j) => filterText(j.position))}
      </Section>
      <Section id="Hotels in Offa" title="Hotels in Offa">
        {show(data.Hotels, (h) => filterText(h.name))}
      </Section>
      <Section id="Public Schools (Tertiary)" title="Public Schools (Tertiary)">
        {show(
          data.Schools.Public_Schools.Tertiary_Institutions,
          (s) => filterText(s.name)
        )}
      </Section>
      <Section
        id="Public Schools (Secondary)"
        title="Public Schools (Secondary)"
      >
        {show(
          data.Schools.Public_Schools.Secondary_Schools,
          (s) => filterText(s.name)
        )}
      </Section>
      <Section id="Public Schools (Primary)" title="Public Schools (Primary)">
        {show(
          data.Schools.Public_Schools.Primary_Schools,
          (s) => filterText(s.name)
        )}
      </Section>
      <Section
        id="Private Tertiary Institution"
        title="Private Tertiary Institution"
      >
        <Card
          title={data.Schools.Private_Schools.Tertiary_Institution.name}
          subtitle={data.Schools.Private_Schools.Tertiary_Institution.type}
          text={data.Schools.Private_Schools.Tertiary_Institution.location}
          onClick={() =>
            setModalData({
              title: data.Schools.Private_Schools.Tertiary_Institution.name,
              text: data.Schools.Private_Schools.Tertiary_Institution.location,
            })
          }
        />
      </Section>
      <Section
        id="Private Secondary Schools"
        title="Private Secondary Schools"
      >
        {show(
          data.Schools.Private_Schools.Secondary_Schools,
          (s) => filterText(s.name)
        )}
      </Section>
      <Section id="Private Primary Schools" title="Private Primary Schools">
        {show(
          data.Schools.Private_Schools.Primary_Schools,
          (s) => filterText(s.name)
        )}
      </Section>
    </>
  );
}
