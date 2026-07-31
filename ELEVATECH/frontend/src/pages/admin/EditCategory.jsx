import { useParams } from "react-router-dom";
import CategoryForm from "../../components/admin/CategoryForm";

export default function EditCategory() {

    const { id } = useParams();

    return (
        <CategoryForm
            mode="edit"
            categoryId={id}
        />
    );
}

