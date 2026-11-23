import {
  selectIngredientById,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@selectors';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector((state) => selectIngredientById(state, id));
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className="text text_type_main-default">
        Не удалось загрузить ингредиент: {error}
      </p>
    );
  }

  if (!ingredientData) {
    return <p className="text text_type_main-default">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
