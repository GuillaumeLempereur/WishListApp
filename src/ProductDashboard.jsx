import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useForm } from "react-hook-form";
import wlEncrypted from './wl-encrypted.js';
import CryptoJS from 'crypto-js'

export function ProductDashboard() {
	const [products, setProducts] = useState(
		[]
	);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
		var key = data.email + data.password;
		var bytes  = CryptoJS.AES.decrypt(wlEncrypted, key);
		try{
			var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			console.log(decryptedData);

			// decode and fill the porducts to display
			setProducts(decryptedData);
		}catch (error){
            console.log("Email or Password is wrong");
			setProducts([]);
		}
    };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
	<>
	  {products.length == 0 && (
		  <>
            <h2>Login Form</h2>

            <form className="App" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Email"
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
            </form>
		  </>
	)}
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-4 fw-bold text-primary">Wish List</h1>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px' }}
              />
              <button className="btn btn-primary">
                <i className="bi bi-search"></i> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for empty search */}
      {searchTerm && filteredProducts.length === 0 && (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle"></i> No products found
          matching "{searchTerm}"
        </div>
      )}

      {/* Products Grid */}
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-lg-4 col-md-6 col-sm-12">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <h3 className="text-primary">{products.length}</h3>
                  <p className="text-muted">Total Products</p>
                </div>
                <div className="col-md-4">
                  <h3 className="text-success">{filteredProducts.length}</h3>
                  <p className="text-muted">Showing</p>
                </div>
                <div className="col-md-4">
                  <h3 className="text-info">$579.97</h3>
                  <p className="text-muted">Total Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	</>
  );
}

export default ProductDashboard;
