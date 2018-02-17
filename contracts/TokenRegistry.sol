pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @notice A service that tracks regulated tokens
contract TokenRegistry is Ownable {

  address[] public tokens;
  address[] public regulators;

  uint public tokenCount = 0;
  uint public regulatorCount = 0;
  
  function TokenRegistry() public {
  }

  function register(address _token, address _regulator) onlyOwner public {
    tokens.push(_token);
    tokenCount += 1;
    regulators.push(_regulator);
    regulatorCount += 1;
  }

  function getToken(uint _index) public view returns (address) {
    return tokens[_index];
  }

  function getRegulator(uint _index) public view returns (address) {
    return regulators[_index];
  }
}