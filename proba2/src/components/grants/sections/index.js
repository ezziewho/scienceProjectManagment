import EquipmentAndSoftware from "./EquipmentAndSoftware";
import IndirectCosts from "./IndirectCosts";
import OpenAccess from "./OpenAccess";
import SalariesAndScholarships from "./SalariesAndScholarships";
import InternationalCooperation from "./InternationalCooperation";
import Abstract from "./Abstract";

import ExternalServices from "./ExternalServices.js";

const sections = {
  equipment: EquipmentAndSoftware,
  services: ExternalServices,
  indirect_costs: IndirectCosts,
  open_access: OpenAccess,
  salaries: SalariesAndScholarships,
  travel: InternationalCooperation,
  others: Abstract,
};

export default sections;
