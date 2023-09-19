import StarsReview from "@/components/stars-review";
import StatusBadge from "@/components/status-badge";
import { Body, Title } from "@/components/typography";
import { useClinic } from "@/hooks/use-clinic";
import { useLocation } from "react-router-dom";

export default function EmployeesDetailPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const { findEmployeeByEmail } = useClinic();
  const selectedEmployee = findEmployeeByEmail(email!);

  if (!selectedEmployee) return null;

  const data: Record<string, any> = {
    "Correo electrónico": (
      <Body.Medium
        className="font-normal text-base-neutral-gray-800"
        text={selectedEmployee.email}
      />
    ),
    Teléfono: (
      <Body.Medium
        className="font-normal text-base-neutral-gray-800"
        text={
          selectedEmployee.telephone_number
            ? selectedEmployee.telephone_number
            : "N/A"
        }
      />
    ),

    Dirección: (
      <Body.Medium
        className="font-normal text-base-neutral-gray-800"
        text={selectedEmployee.address ? selectedEmployee.address : "N/A"}
      />
    ),
    Especialidad: selectedEmployee.specialty,
    Calificación: <StarsReview review={selectedEmployee.score} />,
    Estado: <StatusBadge status={selectedEmployee.status} />,
  };

  return (
    <main className="flex flex-col gap-y-[60px]">
      <section>Name</section>
      <section className="shadow-elevation-1">
        <div className="px-[30px] py-[15px] border border-b-base-neutral-gray-500">
          <Title.Medium className="font-semibold" text="Descripción general" />
        </div>

        <div className="grid grid-cols-2 grid-rows-3 p-[30px]">
          {Object.keys(data).map((key) => (
            <div className="flex flex-row items-center gap-x-[30px]" key={key}>
              <Body.Large className="text-black" text={key} />

              {data[key]}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
