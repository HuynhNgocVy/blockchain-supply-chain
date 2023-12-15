// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Traceability {
    enum ShipmentStatus { MANUFACTURED, QUALITY_CHECKED, IN_TRANSIT, DELIVERED, CANCELLED }
    struct Shipment {
        address manufacturer;
        address verifier;
        address supplier;
        string destination;
        string source;
        string productName;
        string productId;
        uint256 timestamp;
        uint256 deliveryTime;
        ShipmentStatus status;
    }
    mapping(uint256  => Shipment[]) public shipments;

    uint256 public shipmentCount;

    struct TypeShipment {
        address manufacturer;
        address verifier;
        address supplier;
        string destination;
        string source;
        string productId;
        string productName;
        uint256 timestamp;
        uint256 deliveryTime;
        ShipmentStatus status;
    }
    TypeShipment[] typeShipments;

    event ShipmentCreated(address indexed manufacturer, string productId, string destination, string source, string productName, uint256 timestamp, ShipmentStatus status);
    event QualityChecked(address indexed verifier, string productId, string destination, string source, uint256 timestamp, ShipmentStatus status);
    event ShipmentInTransit(address indexed supplier, string productId, string destination, string source, uint256 timestamp, ShipmentStatus status);
    event ShipmentCancelled(address indexed supplier, string productId, uint256 timestamp, ShipmentStatus status);
    event ShipmentDelivered(address indexed supplier, string productId, string destination, string source, uint256 timestamp, uint256 deliveryTime, ShipmentStatus status);

    constructor() {
        shipmentCount = 0;
    }
    function createShipment(
        string memory _destination,
        string memory _source,
        string memory _productId,
        string memory _productName,
        uint256 _timestamp
    ) public {
        // require(shipments[_productId].manufacturer == address(0), "Product already exists");
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));


        Shipment memory newShipment = Shipment({
            manufacturer: msg.sender,
            verifier: address(0),
            supplier: address(0),
            destination: _destination,
            source: _source,
            productName: _productName,
            productId: _productId,
            timestamp: _timestamp,
            deliveryTime: 0,
            status: ShipmentStatus.MANUFACTURED // Khởi tạo trạng thái ban đầu của sản phẩm
        });

        shipments[hashedId].push(newShipment);
        shipmentCount++;
        typeShipments.push(TypeShipment({
            manufacturer: msg.sender,
            verifier: address(0), 
            supplier: address(0),
            destination: _destination,
            source: _source,
            productId: _productId,
            productName: _productName,
            timestamp: _timestamp,
            deliveryTime: 0,
            status: ShipmentStatus.MANUFACTURED
        }));
        emit ShipmentCreated(
            msg.sender,
            _destination,
            _source,
            _productId,
            _productName,
            _timestamp,
            ShipmentStatus.MANUFACTURED
        );
    }
    function checkQuality(address _verifier, string memory _productId, string memory _destination, string memory _source, uint256 _timestamp) public {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));
        Shipment[] storage shipmentArray = shipments[hashedId];
        require(shipmentArray.length > 0, "Product does not exist");
        Shipment storage shipment = shipmentArray[0]; // Lấy lô hàng đầu tiên có _productId
        require(shipment.status == ShipmentStatus.MANUFACTURED, "Shipment already in transit.");

        shipment.destination = _destination;
        shipment.source = _source;
        shipment.verifier = _verifier;
        shipment.status = ShipmentStatus.QUALITY_CHECKED;
        shipment.timestamp = _timestamp;

        for (uint256 i = 0; i < typeShipments.length; i++) {
            if (keccak256(abi.encodePacked(typeShipments[i].productId)) == keccak256(abi.encodePacked(_productId))) {
                TypeShipment storage typeShipment = typeShipments[i];
                typeShipment.verifier = msg.sender;
                typeShipment.status = ShipmentStatus.QUALITY_CHECKED;
                typeShipment.destination = _destination;
                typeShipment.source = _source;
                typeShipment.timestamp = _timestamp;
            }
        }
        emit QualityChecked(
            msg.sender, 
            _productId, 
            _destination,
            _source,
            _timestamp,
            ShipmentStatus.QUALITY_CHECKED);
    }
    function startShipment(address _supplier, string memory _productId, string memory _destination, string memory _source, uint256 _timestamp) public {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));
        Shipment[] storage shipmentArray = shipments[hashedId];
        require(shipmentArray.length > 0, "Product does not exist");
        Shipment storage shipment = shipmentArray[0]; // Lấy lô hàng đầu tiên có _productId
        require(shipment.status == ShipmentStatus.QUALITY_CHECKED, "Shipment does not quality check.");

        shipment.destination = _destination;
        shipment.source = _source;
        shipment.verifier = _supplier;
        shipment.status = ShipmentStatus.IN_TRANSIT;
        shipment.timestamp = _timestamp;

        for (uint256 i = 0; i < typeShipments.length; i++) {
            if (keccak256(abi.encodePacked(typeShipments[i].productId)) == keccak256(abi.encodePacked(_productId))) {
                TypeShipment storage typeShipment = typeShipments[i];
                typeShipment.verifier = msg.sender;
                typeShipment.status = ShipmentStatus.IN_TRANSIT;
                typeShipment.destination = _destination;
                typeShipment.source = _source;
                typeShipment.timestamp = _timestamp;
            }
        }
        emit ShipmentInTransit(
            msg.sender, 
            _productId,
            _destination,
            _source,
            _timestamp,
            ShipmentStatus.IN_TRANSIT);
    }

    function completeShipment(address _supplier, string memory _productId, string memory _destination, string memory _source, uint256 _timestamp) public {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));
        Shipment[] storage shipmentArray = shipments[hashedId];
        require(shipmentArray.length > 0, "Product does not exist");
        Shipment storage shipment = shipmentArray[0]; // Lấy lô hàng đầu tiên có _productId
        require(shipment.status == ShipmentStatus.IN_TRANSIT, "Shipment not in transit.");

        shipment.destination = _destination;
        shipment.source = _source;
        shipment.verifier = _supplier;
        shipment.status = ShipmentStatus.DELIVERED;
        shipment.deliveryTime = block.timestamp;
        shipment.timestamp = _timestamp;

        for (uint256 i = 0; i < typeShipments.length; i++) {
            if (keccak256(abi.encodePacked(typeShipments[i].productId)) == keccak256(abi.encodePacked(_productId))) {
                TypeShipment storage typeShipment = typeShipments[i];
                typeShipment.verifier = msg.sender;
                typeShipment.status = ShipmentStatus.DELIVERED;
                typeShipment.destination = _destination;
                typeShipment.source = _source;
                typeShipment.deliveryTime = block.timestamp;
                typeShipment.timestamp = _timestamp;
            }
        }

        emit ShipmentDelivered(
            _supplier,
            _productId,
            _destination,
            _source,
            _timestamp, 
            block.timestamp,
            ShipmentStatus.IN_TRANSIT);
    }

    function getShipment(string memory _productId) public view returns (string memory, string memory, string memory, string memory, uint256, uint256, ShipmentStatus) {
        uint256 hashedId = uint256(keccak256(abi.encodePacked(_productId)));

        Shipment[] storage shipmentArray = shipments[hashedId];
        Shipment storage shipment= shipmentArray[0];

        return (shipment.destination, shipment.source, shipment.productId, shipment.productName, shipment.deliveryTime, shipment.timestamp, shipment.status);
    }
    // function getSipmentCount(address _sender) public view returns (uint256) {
    //     return shipments[_sender].length;
    // }
    function getAllTransactions() public view returns (TypeShipment[] memory) {
        return typeShipments;
    }
}