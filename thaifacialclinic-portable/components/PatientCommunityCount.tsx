// "Joined by X patients from Y countries" community-size banner.

export default function PatientCommunityCount({
  totalPatients = 4_200,
  totalCountries = 24,
  cuYearsTracked = 5,
}: {
  totalPatients?: number;
  totalCountries?: number;
  cuYearsTracked?: number;
}) {
  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5">
      <div className="grid sm:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-black tabular-nums text-violet-900">{totalPatients.toLocaleString()}+</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">Patients routed</div>
        </div>
        <div className="sm:border-x border-violet-200">
          <div className="text-3xl font-black tabular-nums text-violet-900">{totalCountries}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">Countries served</div>
        </div>
        <div>
          <div className="text-3xl font-black tabular-nums text-violet-900">{cuYearsTracked}yr</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">Tracked outcomes</div>
        </div>
      </div>
    </section>
  );
}
