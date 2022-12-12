import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { mixed } from "yup";
import { useForm } from "react-hook-form";

const Dashoard: React.FC = () => {
    const [customers, setCustomers] = useState<any>([])
    const [customersDetails, setCustomersDetails] = useState<any>({})
    const [customersLoginDetails, setCustomersLoginDetails] = useState<any>({})
    const [address, setAddress] = useState<any>({})
    const [searchEnable, setSearchEnable] = useState<any>(false)
    const [proceed, setProceed] = useState<any>(false)
    const fetchData = async () => {
        const customerResponse = await fetch("http://localhost:5000/customer/selectcustomers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const getcustomers = await customerResponse.json()
        const customerList = getcustomers.data
        setCustomers(getcustomers.data)
        const getFirstCustomer = customerList[0]
        getCustomerDetails(getFirstCustomer)
    }
    useEffect(() => {

        fetchData()
    }, [])
   
    const deleteCustomer = async (id: any) => {
        const deleteCustomerResponse = await fetch(`http://localhost:5000/customer/deleteCustomer/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const res = await deleteCustomerResponse.json()
        toast.success(res.message);
        fetchData()
    }

    const getCustomerDetails = async (data: any) => {
        setCustomersDetails(data)
        const addressrResponse = await fetch(`http://localhost:5000/customer/selectCustomerById/${data._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const getAddress = await addressrResponse.json()
        setAddress(getAddress.data)
    }

    const [firstname, setFirstname] = useState<string>(customersDetails.firstname)
    const [username, setUsername] = useState<any>(customersDetails.username)
    const [lastname, setLastName] = useState(customersDetails.lastname)
    const [email, setEmail] = useState(customersDetails.email)
    const [phone, setPhone] = useState(customersDetails.phone)
    const [dob, setDob] = useState(customersDetails.dob)
    const [gender, setGender] = useState(customersDetails.gender)
    const [password, setPassword] = useState(customersDetails.password)
    const [confirmpassword, setconfirmpassword] = useState(customersDetails.confirmpassword)
    const [Address, setAaddress] = useState(address.address)
    const [landmark, setLandmark] = useState(address.landmark)
    const [city, setCity] = useState(address.city)
    const [state, setState] = useState(address.state)
    const [country, setCountry] = useState(address.country)
    const [zipcode, setZipCode] = useState(address.zipcode)

    const [updateCustomer, setUpdateCustomer] = useState({
        firstname: customersDetails.firstname,
        lastname: customersDetails.username,
        email: customersDetails.email,
        phone: customersDetails.phone,
        dob: customersDetails.dob,
        gender: customersDetails.gender,
        password: customersDetails.password,
        confirmpassword: customersDetails.confirmpassword,
        Address: address.address,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode
    })

    
    function formatDate(date: any) {
        return new Date(date).toLocaleDateString()
    }
 


    const phoneRegExp = /^((\\+[5-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const validationSchema = Yup.object().shape({

        firstname: Yup.string()
            .required("This field is required!"),
        lastname: Yup.string()
            .required("This field is required!"),
        username: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 3 &&
                    val.toString().length <= 20
            )
            .required("This field is required!"),

        email: Yup.string()
            .email("This is not a valid email.")
            .required("This field is required!"),

        phone: Yup.string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .required("this filed is required"),
        dob: Yup.date()
            .required("this filed is required"),
        gender: Yup.string()
            .required("this filed is required"),
        password: Yup.string()
            .test(
                "len",
                "The password must be between 6 and 40 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 6 &&
                    val.toString().length <= 40
            )
            .required("This field is required!"),
        confirmpassword: Yup.string().label('confirm password').required().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        image: mixed().test("fileSize", "The file is too large", (value: any) => {
            if (!value.length) return true // attachment is optional
            return value[0].size <= 2000000
        }),
    });

    const validationAddressSchema = Yup.object().shape({

        address: Yup.string()
            .required("This field is required!"),
        landmark: Yup.string()
            .required("This field is required!"),
        city: Yup.string()
            .required("This field is required!"),
        state: Yup.string()
            .required("This field is required!"),
        country: Yup.string()
            .required("This field is required!"),
        zipcode: Yup.number()
            .required("This field is required!"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const formAddressOptions = { resolver: yupResolver(validationAddressSchema) };
    const { register, handleSubmit, reset, formState: { errors } } = useForm(proceed === false ? formOptions : formAddressOptions);


    const createCustomerLoginDetails = async (data: any) => {
        setCustomersLoginDetails(data)
        setProceed(true)
    };
 

    const createCustomer = async (data: any) => {
        if (proceed === true) {
            const file = customersLoginDetails.image[0]
            try {
                let formdata = new FormData()
                formdata.append('firstname', customersLoginDetails.firstname)
                formdata.append('lastname', customersLoginDetails.lastname)
                formdata.append('username', customersLoginDetails.username)
                formdata.append('email', customersLoginDetails.email)
                formdata.append('phone', customersLoginDetails.phone)
                formdata.append('dob', customersLoginDetails.dob)
                formdata.append('gender', customersLoginDetails.gender)
                formdata.append('password', customersLoginDetails.password)
                formdata.append('confirmPassword', customersLoginDetails.confirmPassword)
                formdata.append('image', file)
                formdata.append('address', data.address)
                formdata.append('landmark', data.landmark)
                formdata.append('city', data.city)
                formdata.append('state', data.state)
                formdata.append('country', data.country)
                formdata.append('zipcode', data.zipcode)
                const response = await fetch('http://localhost:5000/customer/insertCustomer', {
                    method: 'POST',
                    // headers: {
                    //     'content-type': 'multipart/form-data'
                    // },
                    body: formdata,
                })
                const res = await response.json()
                if (res.success === true) {
                    toast.success(res.message);
                    fetchData()
                    setProceed(false)
                } else {
                    toast.error(res.message);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const UpdateCustomer = async () => {
        if (proceed === true) {
            try {
                let formdata = new FormData()
                formdata.append('firstname', firstname)
                formdata.append('lastname', lastname)
                formdata.append('username', username)
                formdata.append('email', email)
                formdata.append('phone', phone)
                formdata.append('dob', dob)
                formdata.append('gender', gender)
                formdata.append('password', password)
                formdata.append('confirmPassword', confirmpassword)
                formdata.append('address', address)
                formdata.append('landmark', landmark)
                formdata.append('city', city)
                formdata.append('state', state)
                formdata.append('country', country)
                formdata.append('zipcode', zipcode)
                const response = await fetch('http://localhost:5000/customer/updateCustomer', {
                    method: 'POST',
                    // headers: {
                    //     'content-type': 'multipart/form-data'
                    // },
                    body: formdata,
                })
                const res = await response.json()
                if (res.success === true) {
                    toast.success(res.message);
                    fetchData()
                    setProceed(false)
                } else {
                    toast.error(res.message);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div>
            {/* modal */}
            <div>
                <div className="modal fade " id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenter" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title mr-2" id="exampleModalLongTitle">Add user</h5>
                                <div className="vr modal-title" style={{ width: '2px', color: '#000000' }}></div>
                                {proceed === false ? <h5 className="modal-title ml-2" id="exampleModalLongTitle">Login details</h5> :
                                    <h5 className="modal-title m2-3" id="exampleModalLongTitle">profile details</h5>}
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    {customersDetails.firstname}
                                    {proceed == false ? <div className="">
                                        <form className="" >
                                            {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
                                            <div className="form-outline mt-4 mb-4">
                                                <input type="text" {...register('firstname')} placeholder="Firstname" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('lastname')} type="text" placeholder="Lastname" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('username')} type="text" placeholder="Username" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('email')} type="email" placeholder="Email" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('phone')} type="number" placeholder="Phone" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('dob')} type="text" placeholder="Dob" className="form-control form-control-lg" />
                                            </div>

                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('gender')} type="text" placeholder="Gender" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('password')} type="password" placeholder="Password" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('confirmpassword')} type="password" placeholder="Confirm Password" className="form-control form-control-lg" />
                                            </div>
                                            <div className="form-outline mt-4 mb-4">
                                                <input {...register('image')} placeholder="Image" className="form-control form-control-lg" type="file" id="image1" />
                                            </div>

                                            <div className="mt-4 ml-4">
                                                <button data-dismiss="modal" type="button" className="btn btn-outline-success btn-lg mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                    <i className="bi  bi bi-x mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                                    <span>Cancel</span>
                                                </button>
                                                <button type="button" onClick={handleSubmit(createCustomerLoginDetails)} className="btn btn-danger btn-lg  mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                    <i className="bi bi-check2 mx-2 mt-2" style={{ fontSize: "20px", color: '#fff' }}></i>
                                                    <span>Procced</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div> :

                                        //details
                                        <div>
                                            <form className="" >
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('address')} type="text" placeholder="Address" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('landmark')} type="text" placeholder="Landmark" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('city')} type="text" placeholder="city" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('state')} type="text" placeholder="State" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('country')} type="text" placeholder="country" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input {...register('zipcode')} type="number" placeholder="Zipcode" className="form-control form-control-lg" />
                                                </div>

                                                <div className="mt-4 ml-4">
                                                    <button type="button" data-dismiss="modal" className="btn btn-outline-success btn-lg mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                        <i className="bi  bi bi-x mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                                        <span>Cancel</span>
                                                    </button>
                                                    <button data-dismiss="modal" type="button" onClick={handleSubmit(createCustomer)} className="btn btn-danger btn-lg  mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                        <i className="bi bi-bookmark-fill mx-2 mt-2" style={{ fontSize: "20px", color: '#fff' }}></i>
                                                        <span>Save</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="modal fade " id="updateModal" role="dialog" aria-labelledby="updateModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title mr-2" id="exampleModalLongTitle">update user</h5>
                                <div className="vr modal-title" style={{ width: '2px', color: '#000000' }}></div>
                                {proceed === false ? <h5 className="modal-title ml-2" id="exampleModalLongTitle">Login details</h5> :
                                    <h5 className="modal-title ml-3" id="exampleModalLongTitle">profile details</h5>}
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div>

                                        {proceed == false ? <div className="">
                                            <form className="" >

                                                <div className="form-outline mt-4 mb-4">
                                                    <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="firstname" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={lastname} type="text" onChange={(e) => setLastName(e.target.value)} placeholder="Lastname" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4" >
                                                    <input value={username} type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={phone} type="number" onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input type="text" placeholder="Dob" onChange={(e) => setDob(e.target.value)} className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={gender} type="text" onChange={(e) => setGender(e.target.value)} placeholder="Gender" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} type="password" placeholder="Confirm Password" className="form-control form-control-lg" />
                                                </div>
                                                <div className="form-outline mt-4 mb-4">
                                                    <input placeholder="Image" className="form-control form-control-lg" type="file" id="image" />
                                                </div>

                                                <div className="mt-4 ml-4">
                                                    <button data-dismiss="modal" type="button" className="btn btn-outline-success btn-lg mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                        <i className="bi  bi bi-x mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                                        <span>Cancel</span>
                                                    </button>
                                                    <button type="button" onClick={() => setProceed(true)} className="btn btn-danger btn-lg  mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                        <i className="bi bi-check2 mx-2 mt-2" style={{ fontSize: "20px", color: '#fff' }}></i>
                                                        <span>Procced</span>
                                                    </button>
                                                </div>
                                            </form>

                                        </div> :

                                            //details
                                            <div>
                                                <form className="" >
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input value={Address} onChange={(e) => setAaddress(e.target.value)} type="text" placeholder="Address" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input value={landmark} onChange={(e) => setLandmark(e.target.value)} type="text" placeholder="Landmark" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="city" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="country" className="form-control form-control-lg" />
                                                    </div>
                                                    <div className="form-outline mt-4 mb-4">
                                                        <input type="number" value={zipcode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zipcode" className="form-control form-control-lg" />
                                                    </div>

                                                    <div className="mt-4 ml-4">
                                                        <button type="button" data-dismiss="modal" className="btn btn-outline-success btn-lg mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                            <i className="bi  bi bi-x mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                                            <span>Cancel</span>
                                                        </button>
                                                        <button data-dismiss="modal" type="button" onClick={UpdateCustomer} className="btn btn-danger btn-lg  mr-4" style={{ width: '44%', borderRadius: 'none' }}>
                                                            <i className="bi bi-bookmark-fill mx-2 mt-2" style={{ fontSize: "20px", color: '#fff' }}></i>
                                                            <span>Save</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container d-flex justify-content-center">
                <div id="my-modal" className="modal fade" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0">
                            <div className="modal-body p-0">
                                <div className="card border-0 p-sm-3 p-2 justify-content-center">
                                    <div className="card-header pb-0 bg-white border-0 "><div className="row"><div className="col ml-auto"><button type="button" className="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div> </div>
                                        <p className="font-weight-bold mb-2"> Are you sure you want to delete this Customer ?</p></div>
                                    <div className="card-body px-sm-4 mb-2 pt-1 pb-0">
                                        <div className="row justify-content-end no-gutters mr-2"><div className="col-auto">
                                            <button type="button" className="btn btn-light text-muted mr-4" data-dismiss="modal">Cancel</button>
                                        </div>
                                            <div className="col-auto">
                                                <button type="button" onClick={() => deleteCustomer(customersDetails._id)} className="btn btn-danger px-4" data-dismiss="modal">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* toast */}
            <div>
                <Toaster position="top-center" />
            </div>

            <nav className="navbar navbar-expand-lg px-2 sticky-top " style={{ background: '#663300' }}>
                <div className="collapse navbar-collapse" id="navbarButtonsExample">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <p className="navbar-brand text-white mt-3">Customer Management</p>
                    </ul>
                    <div className="d-flex align-items-center">
                        <p className="text-white mr-5 text-center mt-3">Customer Admin</p>
                        <img className="rounded-circle" alt="avatar1" height="50" src="images/profile.jpeg" />
                        <p className="text-white mr-4 text-center mt-3 ml-3">{customersDetails.username}</p>
                    </div>
                </div>
            </nav>

            <div>
                <div className="row ml-1">
                    <div className="col-3 shadow-sm p-3 mb-5 bg-body rounded scroll">
                        <div>
                            <div>
                                <div className="d-flex justify-content-between mt-3">
                                    {searchEnable === false ? <h4>Customers</h4> :
                                        <input type="text" name="search"  placeholder="Customers" className="search-input" />}
                                    <div className="d-flex justify-content-end">
                                        <a>
                                            <i className="bi bi-search mr-3" onClick={() => setSearchEnable(true)} style={{ fontSize: "25px" }}></i>
                                        </a>
                                        <a className="dropdown-item" data-toggle="modal" data-target="#exampleModalCenter">
                                            <i className="bi bi-plus-square mx-2" style={{ fontSize: "25px" }}></i>
                                        </a>
                                    </div>
                                </div>
                                <hr className="hr mt-0 mt-1" style={{ opacity: 'unset' }} />
                            </div>
                            {customers.map((items: any) => <div className="my-lst" key={items._id} onClick={() => getCustomerDetails(items)}>
                                <div className="d-flex flex-row" >
                                    <div className="p-2">
                                        <img className="rounded-circle" alt="avatar1" height="50" src={`${items.image}`} />
                                    </div>
                                    <div className="p-2">
                                        <h5 className="mb-0">{items.username}</h5>
                                        <p>{items.email}</p>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div>
                    <div className="col-8 p-3">
                        <div className="p-3" style={{ background: "#ffffff", width: '1225px' }}>
                            <div className="d-flex flex-row p-3">
                                <div className="p-2">
                                    <img className="rounded-circle" alt="avatar1" height="110" src={customersDetails.image} />
                                </div>
                                <div className="p-2 mt-4">
                                    <h5 className="mb-0 mb-2 ml-3">{customersDetails.username}</h5>
                                    <div className='d-flex flex-row'>
                                        <div className="d-flex flex-row mr-5">
                                            <i className="bi  bi-person mx-2" style={{ fontSize: "20px" }}></i>
                                            <p>{customersDetails.firstname}</p>
                                        </div>
                                        <div className="d-flex flex-row mr-5">
                                            <i className="bi  bi-envelope mx-2" style={{ fontSize: "20px" }}></i>
                                            <p>{customersDetails.email}</p>
                                        </div>
                                        <div className="d-flex flex-row mr-5">
                                            <i className="bi  bi-telephone mx-2" style={{ fontSize: "20px" }}></i>
                                            <p>{customersDetails.phone}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button type="button" data-toggle="modal" data-target="#updateModal" className="btn btn-outline-secondary mr-4">
                                            <i className="bi  bi bi-pencil-square mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                            <span>Edit</span>
                                        </button>
                                        <button type="button" data-toggle="modal" data-target="#my-modal" className="btn btn-outline-danger">
                                            <i className="bi  bi bi-trash mx-2 mt-2" style={{ fontSize: "20px" }}></i>
                                            <span>Delete customer</span>
                                        </button>
                                        {/* <button className="btn btn-danger  " data-toggle="modal" data-target="#my-modal">Confirm Delete</button> */}
                                    </div>

                                </div>
                            </div>
                            <hr className="hr mt-0 mt-4" />
                            <div className="mt-5 ml-5">
                                <h3>Personal Details</h3>
                                <div className="row mt-4 ml-3">
                                    <div className="card mr-4" style={{ width: '14rem', background: 'antiquewhite', border: 'none' }}>
                                        <div className="card-body">
                                            <p className="mb-0" >First Name</p>
                                            <h5 className="mb-0">{customersDetails.firstname}</h5>
                                        </div>
                                    </div>
                                    <div className="card mr-4" style={{ width: '14rem', background: 'antiquewhite', border: 'none' }}>
                                        <div className="card-body">
                                            <p className="mb-0" >Last Name</p>
                                            <h5 className="mb-0">{customersDetails.lastname}</h5>
                                        </div>
                                    </div>

                                    <div className="card mr-4" style={{ width: '14rem', background: 'antiquewhite', border: 'none' }}>
                                        <div className="card-body">
                                            <p className="mb-0" >Gender</p>
                                            <h5 className="mb-0">{customersDetails.gender}</h5>
                                        </div>
                                    </div>

                                    <div className="card mr-4" style={{ width: '14rem', background: 'antiquewhite', border: 'none' }}>
                                        <div className="card-body">
                                            <p className="mb-0" >Date of Birth</p>
                                            <h5 className="mb-0">{formatDate(customersDetails.dob)}</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h3>Address</h3>
                                    <div style={{ width: '40%' }} className="ml-3">
                                        <div className="d-flex justify-content-between">
                                            <p className="ml-3 mt-2">Address Line 1</p>
                                            <p className="mr-3 mt-2">{address.address}</p>
                                        </div>
                                        <div className="d-flex justify-content-between " style={{ background: 'antiquewhite' }} >
                                            <p className="ml-3 mt-2">Landmark</p>
                                            <p className="mr-3 mt-2">{address.landmark}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="ml-3 mt-2">city</p>
                                            <p className="mr-3 mt-2">{address.city}</p>
                                        </div>
                                        <div className="d-flex justify-content-between" style={{ background: 'antiquewhite' }}>
                                            <p className="ml-3 mt-2">state</p>
                                            <p className="mr-3 mt-2">{address.state}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashoard;