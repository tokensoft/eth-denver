pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @notice A service that tracks regulated tokens
contract TokenRegistry is Ownable {

  address[] public tokens;
  address[] public regulators;
  
  function TokenRegistry() public {
  }

  function register(address _token, address _regulator) onlyOwner public {
    tokens.push(_token);
    regulators.push(_regulator);
  }

}