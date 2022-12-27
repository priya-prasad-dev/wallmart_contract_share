// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// working step 4 b.s running without accesscontrol
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Wallmart is ERC1155{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _requestIds;
    Counters.Counter private _customerIds;
    //handle over and underflow
    using SafeMath for uint256;

    // bytes32 constant SUPPLIER = keccak256("SUPPLIER");

    address  wallmartAddress = payable (0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
    // address  wallmartAddress = payable (0x90F79bf6EB2c4f870365E785982E1f101E93b906); // wallmart
    uint256[] public productForSale;


    function supportsInterface() public {}

    // address payable suppliersAddress;

    constructor() ERC1155("wallmart") {}
        // wallmartAddress = _wallmartAddress; // 23 dec
        // grantRole(WALLMART, wallmartAddress);
        

    // function assignSupplierRole(address _supplierAddress) public {
    //     // grantRole(SUPPLIER, _supplierAddress);
    // }

    enum ProductStatus {
        CreatedBySupplier,  //0
        RequestedByWallmart,   // 1
        sellerResponseToRequest, //2
        PurchasedByWallmart,    //3
        RequestedByCustomer,    //4
        ShippedByWallmart,      //5
        ReceivedByCustomer      //6
    }

    enum RequestStatus {
        Pending,
        Rejected,
        Approved,
        Complete
    }

    struct Request {
        address requestBy;
        uint256 tokenID;
        uint256 quantity;
        RequestStatus status;
    }

    struct Product {
        string name; //pg
        address payable supplier;
        uint256 productExpiryDate;
        uint256 supplierPrice;
        uint256 priceForCustomer;
        ProductStatus pStatus;
    }
    mapping(uint256 => Request) public customerRequest;
    mapping(uint256 => Request) public wallmartRequest;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Product) public pWallmart;
//  requesting.status = RequestStatus.Pending;

    function getProduct(uint256 _productID)public view returns (Product memory){
        return products[_productID];
    }

    function addProductBySupplier(
        uint256 _tokenId,   // parleG code=1 
        string memory _name,
        uint256 _quantity,
        uint256 _productExpiryDate,
        uint256 _supplierPrice
    ) public  returns (uint256) {
        uint256 tokenId = _tokenId;
        if (tokenId == 0) {
            _tokenIds.increment();
            tokenId = _tokenIds.current();
            
        }

        _mint(_msgSender(), tokenId, _quantity, "");
        Product memory product;
        product.name = _name;
        product.productExpiryDate = _productExpiryDate;
        product.supplierPrice = _supplierPrice;
        product.supplier = payable(_msgSender()); //samsung
         console.log("productCost",product.supplierPrice);
        products[tokenId] = product;
        products[tokenId].pStatus = ProductStatus.CreatedBySupplier; // minted
        return tokenId;
    }

    // wallmart requesting from seller
    function requestFromWallmart(uint256 _tokenId, uint256 _quantity) public {
        _requestIds.increment();
        uint256 requestId = _requestIds.current();

        Request memory requesting;
        requesting.requestBy = _msgSender();
        requesting.tokenID = _tokenId;
        requesting.quantity = _quantity;
        requesting.status = RequestStatus.Pending;
        products[_tokenId].pStatus = ProductStatus.RequestedByWallmart;
        wallmartRequest[requestId] = requesting;
    }

    //  requestforSeller
    // here seller will accept or reject request of wallmart
    // add modifier only owner/seller can accept reauest
    function sellerResponseToRequest(
        uint256 _wallmartRequestID,
        bool _isApproved
    ) public payable {
        Request memory request = wallmartRequest[_wallmartRequestID];
        request.status = _isApproved
            ? RequestStatus.Approved
            : RequestStatus.Rejected;

        if (_isApproved) {
            if (request.quantity > balanceOf(msg.sender, request.tokenID)) {
                uint256 missingMint = request.quantity -
                    balanceOf(msg.sender, request.tokenID);
                _mint(_msgSender(), request.tokenID, missingMint, "");
            }
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);

            wallmartRequest[_wallmartRequestID].status = RequestStatus.Approved;
            products[_wallmartRequestID].pStatus = ProductStatus.sellerResponseToRequest;////
        } else {
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);
        }
        
    }

    function purchaseByWallmart(
        uint256 _wallmartRequestID,
        uint256 _sellingPrice
    ) public payable {
        Request memory request = wallmartRequest[_wallmartRequestID];
        require(
            request.status == RequestStatus.Approved,
            "Request status is not APPROVED"
        );
        require(request.requestBy == msg.sender, "Unauthorised");

        Product memory product = products[request.tokenID];
        uint256 productCost = product.supplierPrice * request.quantity;
        products[request.tokenID].priceForCustomer = _sellingPrice;
            console.log("productCost",productCost);
        require(msg.value == productCost, "Please send exact product price");

        // transfering quantity from supplier to wallmart
        safeTransferFrom(
            product.supplier,
            request.requestBy,
            request.tokenID,
            request.quantity,
            ""
        );
        // transfer money from wallmart to supplier
        payable(product.supplier).transfer(productCost);
        request.status = RequestStatus.Complete;
        wallmartRequest[_wallmartRequestID] = request;
        // ===
        // uint256 productCountForSale = _tokenIds.current();
        //   ====
        _setApprovalForAll(product.supplier, msg.sender, false);
        products[_wallmartRequestID].pStatus = ProductStatus.PurchasedByWallmart;
    }

//     ====       ====        ====
 function fetchSupplierProducts() public view returns (Product[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (products[i + 1].supplier == msg.sender) {
          itemCount += 1;
        }
      }

      Product[] memory items = new Product[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (products[i + 1].supplier == msg.sender) {
          uint currentId = i + 1;
          Product storage currentItem = products[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
//     ====       ====        ====
//     ====     products owned by Wallmart      ====  START
 function fetchWallmartProducts() public view returns (Product[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (wallmartRequest[i + 1].requestBy == msg.sender) {
            console.log("wllmrt",wallmartRequest[i + 1].requestBy);
          itemCount += 1;
        }
    //Product memory product;
      //products[tokenId] = product;  
      }

      Product[] memory items = new Product[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        // if (products[i + 1].supplier == msg.sender) {
        if (wallmartRequest[i + 1].requestBy == msg.sender) {
          uint currentId = i + 1;
          Product storage currentItem = products[currentId];
          items[currentIndex] = currentItem;
        //   console.log("itms",currentItem);
          currentIndex += 1;
        }
      }
      return items;
    }
//     ====     products owned by Wallmart      ====  END
                         //*****\\
//     ====     products owned by Customer      ====  START
 function fetchCustomerProducts() public view returns (Product[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (customerRequest[i + 1].requestBy == msg.sender) {
            console.log("wllmrt",customerRequest[i + 1].requestBy);
          itemCount += 1;
        }
    //Product memory product;
      //products[tokenId] = product;  
      }

      Product[] memory items = new Product[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        // if (products[i + 1].supplier == msg.sender) {
        if (customerRequest[i + 1].requestBy == msg.sender) {
          uint currentId = i + 1;
          Product storage currentItem = products[currentId];
          items[currentIndex] = currentItem;
        //   console.log("itms",currentItem);
          currentIndex += 1;
        }
      }
      return items;
    }
//     ====     products owned by Customer      ====  END

    function viewProductForSale() public view returns (uint256[] memory) {
        uint256 productCount = _tokenIds.current(); //
        // uint256[] memory tokenForSale;
         uint256[] memory tokenForSale = new uint256[](productCount);   //

        uint256 j = 0;
        for (uint256 i = 1; i <= productCount; i++) {
            if (balanceOf(wallmartAddress, i) > 0) {
                // tokens.push()
                tokenForSale[j++] = i;
            }
        }
        return tokenForSale;
    }

    function requestByCustomer(uint256 _tokenID, uint256 _quantity)
        public
    {
        console.log(wallmartAddress);
        require(
            balanceOf(wallmartAddress, _tokenID) >= _quantity,
            "Wallmart does not have this much quantity"
        );

        _customerIds.increment(); // initial value 1
        uint256 customerId = _customerIds.current();

        Request memory requesting;
        requesting.requestBy = _msgSender();
        requesting.tokenID = _tokenID;
        requesting.quantity = _quantity;
        requesting.status = RequestStatus.Pending;
        // customerRequest[_tokenID].status = ProductStatus.PurchasedByCustomer;
        // customerRequest[_customerIds].status = RequestStatus.Approved;
        customerRequest[customerId] = requesting;
        products[_tokenID].pStatus = ProductStatus.RequestedByCustomer;////
    }

    // Here wallmart will see all the request made by customers
    // function viewIncomingRequest() public {}
    // w
    function wallmartResponseToCustomer(
        uint256 _customerRequestID,
        bool _isApproved
    ) public {
        Request memory request = customerRequest[_customerRequestID];
        request.status = _isApproved
            ? RequestStatus.Approved
            : RequestStatus.Rejected;

        if (_isApproved) {
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);
            customerRequest[_customerRequestID].status = RequestStatus.Approved;
            products[_customerRequestID].pStatus = ProductStatus.ShippedByWallmart;////
        } else {
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);
        }
        
    }
    // c
    function purchaseByCustomer(uint256 _customerRequestID) public payable {
        Request memory cRequest = customerRequest[_customerRequestID];
        require(
            cRequest.status == RequestStatus.Approved,
            "Request status is not APPROVED"
        );
        require(cRequest.requestBy == msg.sender, "Unauthorised");

        Product memory product = products[cRequest.tokenID];
        uint256 productCost = product.priceForCustomer * cRequest.quantity;
        console.log("==> ", productCost, msg.value);
        require(msg.value == productCost, "Please send exact product price");
        // transfering quantity from wallmart to customer
        safeTransferFrom(
            wallmartAddress,
            cRequest.requestBy,
            cRequest.tokenID,
            cRequest.quantity,
            ""
        );

        // transfer money from customer to wallmart
        payable(wallmartAddress).transfer(productCost);
        cRequest.status = RequestStatus.Complete;
        products[_customerRequestID].pStatus = ProductStatus.ReceivedByCustomer;////
        customerRequest[_customerRequestID] = cRequest;
        _setApprovalForAll(wallmartAddress, msg.sender, false);
    }
}
