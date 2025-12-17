import { AllCategories } from "@/actions/actions"
import FilterSidebar from "./FilterSidebar/FilterSidebar"
import FilterSection from "@/components/Ui/Products/FilterSection/FilterSection"

const FilterProducts = async({slug}) => {
    const categories = await AllCategories()

  return (
    <div>
        <FilterSection slug={JSON.stringify(slug)}/>
        <FilterSidebar cats={ JSON.stringify(categories)} />
    </div>
  )
}

export default FilterProducts