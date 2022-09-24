import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import MyContext from '../context/MyContext';
import * as S from './styled';
import {
  addCartItemIfNotExists,
  changeCartItemQuantity,
  getCart,
  getCartItem,
  removeCartItem } from '../services/cartService';

export default function ProductsCard(props) {
  const { product } = props;
  const { setTotal, setCartItems } = useContext(MyContext);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setQuantity(getCartItem(product.id)?.quantity || 0);
  }, [product.id]);

  useEffect(() => {
    if (quantity === 0) {
      removeCartItem(product.id);
    } else {
      addCartItemIfNotExists({ ...product, quantity });
    }
    changeCartItemQuantity(product.id, quantity);
    setCartItems(getCart());
    const totalPrice = getCart().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    setTotal(totalPrice);
  }, [product, product.id, quantity, setCartItems, setTotal]);

  return (
    <S.Container key={ product.id }>
      <S.Title
        data-testid={ `customer_products__element-card-title-${product.id}` }
      >
        {product.name}
      </S.Title>
      <S.Title
        data-testid={ `customer_products__element-card-price-${product.id}` }
      >
        {parseFloat(product.price).toFixed(2).toString().replace('.', ',')}
      </S.Title>
      <S.Image>
        <img
          src={ product.urlImage }
          width={ 100 }
          alt={ product.name }
          data-testid={ `customer_products__img-card-bg-image-${product.id}` }
        />
      </S.Image>
      <button
        type="button"
        id={ `button-increase-${product.id}` }
        onClick={ () => setQuantity(quantity + 1) }
        data-testid={ `customer_products__button-card-add-item-${product.id}` }
      >
        +
      </button>
      <button
        type="button"
        id={ `button-decrease-${product.id}` }
        onClick={ () => setQuantity(quantity - 1) }
        disabled={ quantity <= 0 }
        data-testid={ `customer_products__button-card-rm-item-${product.id}` }
      >
        -
      </button>
      <label htmlFor="input-quantity">
        <input
          type="number"
          id={ `input-quantity-${product.id}` }
          name="quantity"
          value={ quantity }
          onChange={ ({ target }) => setQuantity(Number(target.value)) }
          data-testid={ `customer_products__input-card-quantity-${product.id}` }
        />
      </label>
    </S.Container>
  );
}

ProductsCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    urlImage: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
};
