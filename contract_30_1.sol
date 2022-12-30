// with event method and id balance 


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

    using SafeMath for uint256;

    // address  wallmartAddress = payable (0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db); // wallmart
    address  wallmartAddress = payable (0x90F79bf6EB2c4f870365E785982E1f101E93b906); // wallmart
    uint256[] public productForSale;

    function supportsInterface() public {}

    constructor() ERC1155("wallmart") {}
  

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

    // struct Dummy {
    //     address requestBy;
    //     uint256 chkBal;   
    // }

    struct Request {
        address requestBy;
        uint256 tokenID;
        uint256 quantity;
        uint256 wallBall;
        RequestStatus status;
    }

    struct Product {
        uint256 id;
        string name; //pg
        address payable supplier;
        uint256 productExpiryDate;
        uint256 supplierPrice;
        uint256 quantity;
        uint256 priceForCustomer;
        ProductStatus pStatus;
        uint256 bal;
    }       
    mapping(uint256 => Request) public customerRequest;
    mapping(uint256 => Request) public wallmartRequest;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Product) public pWallmart;

    event Deposit( bytes32 indexed tokenID);

    function addProductBySupplier(
        uint256 _tokenId,   // parleG code=1 
        string memory _name,
        uint256 _quantity,
        uint256 _productExpiryDate,
        uint256 _supplierPrice
    ) public  returns (uint256) {
        uint256 tokenId = _tokenId;
        // uint id;
        if (tokenId == 0) {
            _tokenIds.increment();
            tokenId = _tokenIds.current();
            
        }

        _mint(_msgSender(), tokenId, _quantity, "");

        Product memory product;
        product.id = tokenId;
        product.name = _name;
        product.productExpiryDate = _productExpiryDate;
        product.supplierPrice = _supplierPrice;
        product.quantity = _quantity;
        product.supplier = payable(_msgSender()); //samsung
        uint256 abc = balanceOf(product.supplier,product.id);
        product.bal = abc;
        products[tokenId] = product;
        // uint256 bal = balanceOf(_address,_tokenID);
        products[tokenId].pStatus = ProductStatus.CreatedBySupplier; // minted
        return (tokenId);
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
        // uint uid;
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
            // uid =uid+1;

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
        // request.wallBall = balanceOf(request.requestBy,request.tokenID); //
        wallmartRequest[_wallmartRequestID] = request;
        // product.bal = balanceOf(product.supplier,request.tokenID);
        // uint256 balofSup = balanceOf(product.supplier,request.tokenID);
        // uint256 balofwall = balanceOf(request.requestBy,request.tokenID);
        // uint256 finalBal = balofSup - balofwall;
        // product.bal = finalBal;
        // products[request.tokenID] = product;
        _setApprovalForAll(product.supplier, msg.sender, false);
        products[_wallmartRequestID].pStatus = ProductStatus.PurchasedByWallmart;
    }
event Item (uint256 currentId,uint Ball);
    
//     ====       ====        ====
   function getAllProducts() public returns (Product[] memory) {
        uint256 productCount = _tokenIds.current(); //
        Product[] memory tokens = new Product[](productCount);
        console.log("productCountG ->",productCount);
        uint256 currentIndex = 0;
        uint256 currentId;
        for (uint256 i = 0; i < productCount; i++) {
            currentId = i + 1;

            // Product storage currentItem = products[currentId];
            Product storage currentItem = products[currentId];
             console.log ("idd",currentId);
            currentItem.bal = balanceOf(msg.sender,currentId);
            console.log ("ballll",currentItem.bal);
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
            emit Item(currentId,currentItem.bal);
        }
    
        return tokens;
    }

 function totalMintedItems() public view returns (uint) {
        uint256 productCount = _tokenIds.current(); //
        console.log("productCountG ->",productCount);
        return productCount;
    }

    function checkBalance(address _address, uint256 _tokenID) public  view returns(uint) {
           uint256 bal = balanceOf(_address,_tokenID);
           return bal;
    }

 function fetchWallmartProducts() public view returns (Product[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (wallmartRequest[i + 1].requestBy == msg.sender) {
            console.log("wllmrt",wallmartRequest[i + 1].requestBy);
          itemCount += 1;
        }
 
      }

      Product[] memory items = new Product[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        // if (products[i + 1].supplier == msg.sender) {
        if (wallmartRequest[i + 1].requestBy == msg.sender && balanceOf(wallmartAddress, i+1) > 0) {
          uint currentId = i + 1;
          Product storage currentItem = products[currentId];
          items[currentIndex] = currentItem;
        //   console.log("itms",currentItem);
          currentIndex += 1;
        }
      }
      return items;
    }

//     ====     products owned by Customer      ====  START
//  function fetchCustomerProducts() public view returns (Product[] memory) {
//       uint totalItemCount = _tokenIds.current();
//       uint itemCount = 0;
//       uint currentIndex = 0;

//       for (uint i = 0; i < totalItemCount; i++) {
//         if (customerRequest[i + 1].requestBy == msg.sender) {
//             console.log("wllmrt",customerRequest[i + 1].requestBy);
//           itemCount += 1;
//         } 
//       }

//       Product[] memory items = new Product[](itemCount);
//       for (uint i = 0; i < totalItemCount; i++) {
//         // if (products[i + 1].supplier == msg.sender) {
//         if (customerRequest[i + 1].requestBy == msg.sender) {
//           uint currentId = i + 1;
//           Product storage currentItem = products[currentId];
//           items[currentIndex] = currentItem;
//         //   console.log("itms",currentItem);
//           currentIndex += 1;
//         }
//       }
//       return items;
//     }

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
        customerRequest[customerId] = requesting;
        products[_tokenID].pStatus = ProductStatus.RequestedByCustomer;////
    }

 
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
        // product.bal = balanceOf(product.supplier,cRequest.tokenID);
        cRequest.status = RequestStatus.Complete;
        products[_customerRequestID].pStatus = ProductStatus.ReceivedByCustomer;////
        customerRequest[_customerRequestID] = cRequest;
        _setApprovalForAll(wallmartAddress, msg.sender, false);
    }
}
